"use server";
import { db } from "@/src/index";
import { bookingItems, bookings, bookingStations, devices, foodItems, gameStations, profiles } from "@/src/db/schema";
import { eq, and, gte, lt, asc, desc, inArray, gt, ne, or } from "drizzle-orm";
import { resolveAuthenticatedUser } from "@/lib/utils/helperFunctions";
import { BookSeatInput, bookSeatSchema, getBookingDetailsInput, getBookingDetailsSchema, SeatHoldeInput, seatHoldSchema, verifyPaymentSchema, VerifySignatureInput } from "@/lib/validations/bookingValidation";
import { razorpay } from "@/lib/setup-files/razorpay.config";
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils";
import { formatToNormalDate, formatToNormalTime, rupeesToPaise } from "@/lib/utils/tools";
import { BookingDetailsResponse } from "@/types/bookingTypes";
import { addPoints, redeemPoints } from "@/lib/actions/rewardActions";

//Main functions
export const getCurrentBookings = async (): Promise<{
    success: boolean;
    message?: string;
    data?: Array<typeof bookings.$inferSelect>;
}> => {
    const { dbuser, error } = await resolveAuthenticatedUser("user");
    if (error) return error;

    const now = new Date();

    try {
        const gotBookings = await db.select().from(bookings).where(and(
            eq(bookings.userId, dbuser.userId),
            eq(bookings.isArchived, false),
            gte(bookings.endTime, now)
        )).orderBy(asc(bookings.startTime));

        return {
            success: true,
            data: gotBookings
        }
    }
    catch (err) {
        console.error("[getCurrentBookings]: ", err)
        return {
            success: false,
            message: "Server Error"
        }
    }
};

export const getActiveBooking = async (): Promise<{
    success: boolean;
    message?: string;
    data?: {
        bookingId: string;
        deviceName: string;
        holdExpiresAt: string | Date;
        status: string;
        stationLabel: string;
    } | null
}> => {
    try {
        //Authentication
        const { dbuser, error: authError } = await resolveAuthenticatedUser("user");
        if (authError) return authError;

        const now = new Date();
        const [activeBooking] = await db.select({
            bookingId: bookings.id,
            deviceName: devices.deviceName,
            holdExpiresAt: bookings.holdExpiresAt,
            status: bookings.bookingStatus,
            deviceType: devices.type,

            //For station
            stationLabel: gameStations.frontendLabel
        })
            .from(bookings)
            .innerJoin(bookingStations, eq(bookingStations.bookingId, bookings.id))
            .innerJoin(gameStations, eq(bookingStations.gameStationId, gameStations.id))
            .innerJoin(devices, eq(gameStations.deviceId, devices.id))
            .where(and(
                eq(bookings.userId, dbuser.userId),
                inArray(bookings.bookingStatus, ["pending", "hold"]),
                eq(bookings.isArchived, false),
                gte(bookings.holdExpiresAt, now)
            ))
            .limit(1);

        if (!activeBooking) {
            return {
                success: true,
                data: null
            }
        }

        return {
            success: true,
            data: {
                bookingId: activeBooking.bookingId,
                deviceName: String(activeBooking.deviceName + "-" + activeBooking.deviceType),
                holdExpiresAt: activeBooking.holdExpiresAt!,
                status: activeBooking.status,
                stationLabel: activeBooking.stationLabel
            }
        }
    }
    catch (err) {
        console.error("[getActiveBooking]: ", err);
        return {
            success: false,
            message: "Something Went Wrong"
        }
    }
};

export const getBookingDetails = async (input: getBookingDetailsInput): Promise<BookingDetailsResponse> => {
    try {
        const { error: zoderror, data: parsedId } = getBookingDetailsSchema.safeParse(input);
        if (zoderror) return { success: false, message: zoderror.message };

        const { dbuser, error: authError } = await resolveAuthenticatedUser("user");
        if (authError) return authError;

        const result = await db.select({
            id: bookings.id,
            status: bookings.bookingStatus,
            startTime: bookings.startTime,
            endTime: bookings.endTime,
            totalAmount: bookings.totalAmount,
            playersCount: bookings.playersCount,
            holdExpiresAt: bookings.holdExpiresAt,
            razorpayOrderId: bookings.razorpayOrderId,

            // Device info
            deviceName: devices.deviceName,
            hourlyRate: devices.hourlyRate,

            // Snack info (from leftJoin)
            foodName: foodItems.name,
            foodQty: bookingItems.qty,
            foodPrice: bookingItems.unitPrice,
        })
            .from(bookings)
            .innerJoin(bookingStations, eq(bookingStations.bookingId, bookings.id))
            .innerJoin(gameStations, eq(bookingStations.gameStationId, gameStations.id))
            .innerJoin(devices, eq(gameStations.deviceId, devices.id))
            .leftJoin(bookingItems, eq(bookings.id, bookingItems.bookingId))
            .leftJoin(foodItems, eq(bookingItems.foodItemId, foodItems.id))
            .where(and(
                eq(bookings.id, parsedId.bookingId),
                eq(bookings.userId, dbuser.userId)
            ));

        if (result.length === 0) {
            return { success: false, message: "Booking not found" };
        }
        const baseRow = result[0];
        const foodMap = new Map<string, { name: string; unitPrice: string; qty: number }>();
        for (const r of result) {
            if (r.foodName && !foodMap.has(r.foodName)) {
                foodMap.set(r.foodName, {
                    name: r.foodName,
                    qty: r.foodQty!,
                    unitPrice: r.foodPrice!
                })
            }
        }
        const foodItemsArray = Array.from(foodMap.values());

        return {
            success: true,
            data: {
                id: baseRow.id,
                status: baseRow.status,
                holdExpiresAt: baseRow.holdExpiresAt,
                totalAmount: baseRow.totalAmount,
                endTime: baseRow.endTime,
                startTime: baseRow.startTime,
                hourlyRate: baseRow.hourlyRate,
                playersCount: baseRow.playersCount,
                razorpayOrderId: baseRow.razorpayOrderId,

                deviceName: baseRow.deviceName,

                foodItems: foodItemsArray
            }
        }
    }
    catch (err) {
        console.error("[getBookingDetails]: ", err);
        return {
            success: false,
            message: "Something Went Wrong, Try again"
        }
    }
};

export const getBookingHistory = async (): Promise<{
    success: boolean;
    message?: string;
    data?: Array<typeof bookings.$inferSelect>
}> => {
    const { dbuser, error } = await resolveAuthenticatedUser("user");
    if (error) return error;

    const now = new Date();

    try {
        const pastBookings = await db.select().from(bookings).where(and(
            eq(bookings.userId, dbuser.userId),
            eq(bookings.isArchived, false),
            lt(bookings.endTime, now)
        )).orderBy(desc(bookings.startTime));

        return {
            success: true,
            data: pastBookings
        }
    }
    catch (err) {
        console.error("[getBookingHistory]: ", err)
        return {
            success: false,
            message: "Server Error"
        }
    }
};

export const holdSeat = async (input: SeatHoldeInput): Promise<{
    success: boolean;
    message?: string;
    data?: typeof bookings.$inferSelect
}> => {
    try {
        //Verify authentication
        const { dbuser, error } = await resolveAuthenticatedUser("user");
        if (error) return error;
        //Parsing
        const { error: zoderror, data: parsed } = seatHoldSchema.safeParse(input);
        if (zoderror) { return { success: false, message: zoderror.message } };
        if (parsed.gameStations.length === 0) {
            return {
                success: false,
                message: "Choose Atleast one station to play"
            }
        }
        //Input Checks
        const now = new Date();
        const convertedStartTime = new Date(parsed.startTime);
        const convertedEndTime = new Date(parsed.endTime);
        const durationInHours = (convertedEndTime.getTime() - convertedStartTime.getTime()) / (1000 * 60 * 60);

        if (convertedStartTime >= convertedEndTime) {
            return {
                success: false,
                message: "Endtime must be after StartTime"
            }
        };
        if (convertedStartTime < now) {
            return {
                success: false,
                message: "StartTime must be in future"
            }
        };
        if (durationInHours < 0.5) {
            return {
                success: false,
                message: "Minimum duration must be 30 minutes"
            }
        };
        const requestedStationIds = parsed.gameStations.map((s) => s.stationId);
        const dbRecords = requestedStationIds.length > 0 ?
            await db.select({
                stationId: gameStations.id,
                stationLabel: gameStations.stationLabel,
                frontendLabel: gameStations.frontendLabel,
                isActive: gameStations.isActive,

                //Device Details
                deviceId: devices.id,
                deviceName: devices.deviceName,
                maxPlayers: devices.maxPlayers,
                extraConsolePrice: devices.extraConsolePrice,
                deviceHourlyRate: devices.hourlyRate,

                conflictBookingId: bookings.id,
            })
                .from(gameStations)
                .innerJoin(devices, eq(gameStations.deviceId, devices.id))
                .leftJoin(bookingStations, and(
                    eq(bookingStations.gameStationId, gameStations.id),
                    lt(bookingStations.startTime, convertedEndTime),
                    gt(bookingStations.endTime, convertedStartTime)
                ))
                .leftJoin(bookings, and(
                    eq(bookings.id, bookingStations.bookingId),
                    eq(bookings.isArchived, false),
                    inArray(bookings.bookingStatus, ["hold", "confirmed", "pending"]),
                    or(
                        ne(bookings.bookingStatus, "hold"),
                        gt(bookings.holdExpiresAt, now)
                    )
                ))
                .where(inArray(gameStations.id, requestedStationIds))
            : [];

        if (dbRecords.length === 0 || new Set(dbRecords.map(s => s.stationId)).size !== requestedStationIds.length) {
            return {
                success: false,
                message: "One or more selected Stations do not exist"
            }
        };
        const inactiveStations = dbRecords.filter((s) => !s.isActive);
        if (inactiveStations.length > 0) {
            return {
                success: false,
                message: `Stations Under Maintenance: ${inactiveStations.map((s) => s.frontendLabel).join(", ")}`
            }
        };

        const conflict = dbRecords.find(s => s.conflictBookingId !== null);
        if (conflict) {
            return {
                success: false,
                message: `Station ${conflict.frontendLabel} is already reserved for this time.`
            }
        };

        const stationsMapped = new Map(dbRecords.map((s) => [s.stationId, s]));
        let totalPlayers = 0;
        let totalCalculatedAmount = 0;

        for (const item of parsed.gameStations) {
            //First get the station by id
            const singleStation = stationsMapped.get(item.stationId)!;

            //playerscount check 
            if (item.playersCount <= 0 || item.playersCount > singleStation.maxPlayers) {
                return {
                    success: false,
                    message: `Station ${singleStation.frontendLabel} allows 1 to ${singleStation.maxPlayers} players.`
                };
            };

            //totalplayers add
            totalPlayers += item.playersCount;
            //totalamount calculate
            totalCalculatedAmount += durationInHours * Number(singleStation.deviceHourlyRate) * item.playersCount;
        };

        const holdExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
        //Run cleanup & Insert new booking with hold
        const newBooking = await db.transaction(async (tx) => {
            const [insertedData] = await tx.insert(bookings).values({
                userId: dbuser.userId,
                endTime: convertedEndTime,
                startTime: convertedStartTime,
                totalAmount: totalCalculatedAmount.toFixed(2),
                bookingStatus: "hold",
                holdExpiresAt: holdExpiresAt,
                playersCount: totalPlayers
            }).returning();

            const stationRows: Array<typeof bookingStations.$inferInsert> = parsed.gameStations.map((station) => ({
                bookingId: insertedData.id,
                gameStationId: station.stationId,
                startTime: convertedStartTime,
                endTime: convertedEndTime,
                playersCount: station.playersCount
            }));
            await tx.insert(bookingStations).values(stationRows);

            return insertedData;
        });

        return {
            success: true,
            data: newBooking,
            message: `Seat held for 5 minutes`
        };
    }
    catch (err: any) {
        if (err?.message === "NO_STATIONS_AVAILABLE") {
            return {
                success: false,
                message: "All setups for this device are currently booked for the selected time slot."
            };
        }

        const code = err?.code ?? err?.cause?.code;
        if (code === "23P01") {
            return {
                success: false,
                message: "This station was just claimed by someone else. Please try again.",
            };
        }

        console.error("[holdSeat]: ", err);
        return {
            success: false,
            message: "Something went wrong while holding the seat."
        };
    }
};

export const bookSeat = async (input: BookSeatInput): Promise<{
    success: boolean;
    message?: string;
    data?: {
        razorpay_orderId: string;
        updatedBooking: typeof bookings.$inferSelect;
    }
}> => {
    try {
        //Checking user
        const { error: usererror, dbuser } = await resolveAuthenticatedUser("user");
        if (usererror) return usererror;
        //Checking Input
        const { data: parsedinput, error: zodError } = bookSeatSchema.safeParse(input);
        if (zodError) return { success: false, message: zodError.message };
        //Check if seat held and belongs to current user
        const [booking] = await db.select().from(bookings).where(and(
            eq(bookings.id, parsedinput.bookingId),
            eq(bookings.userId, dbuser.userId)
        ));

        if (!booking) {
            return {
                success: false,
                message: "Booking not found"
            }
        };

        //Checking times
        const now = new Date();
        const expiretime = booking.holdExpiresAt ? new Date(booking.holdExpiresAt) : null;
        //Checking if hold time is ended
        if (!expiretime || expiretime < now) {
            return {
                success: false,
                message: "Booking expired or not held by you"
            }
        };
        //Checking if user left after creating new booking and comes back to retry -- Idempotent function
        if (booking.bookingStatus === "pending" && booking.razorpayOrderId) {
            return {
                success: true,
                data: {
                    razorpay_orderId: booking.razorpayOrderId,
                    updatedBooking: booking
                }
            }
        };
        //Checking if user has failed payment/booking
        if (booking.bookingStatus === "cancelled") {
            return {
                success: false,
                message: "This booking has been cancelled, Please Start New Booking"
            }
        };
        //Returning if this booking is already confirmed -- Race Condition
        if (booking.bookingStatus === "confirmed") {
            return {
                success: false,
                message: "This booking is ALREADY PAID and CONFIRMED"
            }
        }
        //Checking if user has holded seat before creating a new booking
        if (booking.bookingStatus !== "hold") {
            return {
                success: false,
                message: "Booking Expired"
            }
        }
        //Extracting foodItemId from frontend - used Set to avoid duplicate ids
        const foodItemIds = [...new Set(parsedinput.foodItems.map((f) => f.foodItemId))];
        //Getting details of foodItem from database containing same Ids
        const foodItemsforBooking = foodItemIds.length > 0
            ? await db.select().from(foodItems).where(inArray(foodItems.id, foodItemIds))
            : [];
        //Checking if item is out of stock
        const outOfStock = foodItemsforBooking.filter(item => !item.isAvailable);
        if (outOfStock.length > 0) {
            return {
                success: false,
                message: `Items out of stock: ${outOfStock.map(i => i.name).join(", ")}`
            };
        };
        //Filtering which foodItems Details are found in database
        const foundIds = new Set(
            foodItemsforBooking.map((item) => item.id)
        );
        //Counting Missing Ids from database
        const missingIds = foodItemIds.filter(
            (id) => !foundIds.has(id)
        );
        if (missingIds.length > 0) {
            return {
                success: false,
                message: `Food items not found: ${missingIds.join(", ")}`
            }
        };
        //Converting each foodItem in object that database required before inserting all togather
        const foodsMapped = new Map(foodItemsforBooking.map((f) => [f.id, f]));
        const foodsForJunctionTable = parsedinput.foodItems.map((item) => {
            const singleItem = foodsMapped.get(item.foodItemId);

            return {
                bookingId: booking.id,
                foodItemId: item.foodItemId,
                unitPrice: singleItem?.price!,
                qty: item.qty,
            }
        });
        //Calculating total amount
        const totalAmount = parsedinput.foodItems.reduce((sum, item) => {
            const singleItem = foodsMapped.get(item.foodItemId);
            return sum + Number(singleItem?.price) * item.qty
        }, 0);
        //The amount to send in frontend for review screen
        const finalBookingAmount = (Number(totalAmount) + Number(booking.totalAmount)).toFixed(2);
        //Converted that amount in paise because razorpay takes it in paise
        const totalAmountInPaise = rupeesToPaise(finalBookingAmount);
        //Creating Razropay order
        const razorOrder = await razorpay.orders.create({
            amount: totalAmountInPaise,
            currency: "INR",
            receipt: booking.id,
            notes: {
                bookingId: booking.id
            }
        });
        //Transection for foodItems insertion and updating booking
        const newBooking = await db.transaction(async (tx) => {
            if (foodsForJunctionTable.length > 0) {
                await tx.insert(bookingItems).values(foodsForJunctionTable)
            };

            const [updatedBooking] = await tx.update(bookings).set({
                bookingStatus: "pending",
                totalAmount: finalBookingAmount,
                razorpayOrderId: razorOrder.id
            }).where(eq(bookings.id, booking.id)).returning();

            return {
                success: true,
                updatedBooking,
                razorpay_order_id: razorOrder.id
            }
        });

        if (!newBooking.success) {
            return {
                success: false,
                message: "Booking Failed"
            }
        };

        return {
            success: true,
            data: {
                razorpay_orderId: newBooking.razorpay_order_id!,
                updatedBooking: newBooking.updatedBooking!
            }
        }
    }
    catch (err) {
        console.error("[bookSeat]: ", err);
        return {
            success: false,
            message: "Something Went Wrong while booking"
        }
    }
};

export const cancelBooking = async (bookingId: string): Promise<{
    success: boolean;
    message?: string;
}> => {
    try {
        const { error: authError, dbuser } = await resolveAuthenticatedUser("user");
        if (authError) return authError;
        if (!bookingId) return { success: false, message: "Please Provide booking Id" };
        const [bookingFound] = await db.select().from(bookings).where(and(
            eq(bookings.userId, dbuser.userId),
            eq(bookings.id, bookingId),
            eq(bookings.isArchived, false)
        ));

        if (!bookingFound) {
            return {
                success: false,
                message: "Booking Not Found"
            }
        };

        if (bookingFound.bookingStatus === "completed" || bookingFound.bookingStatus === "cancelled") {
            return {
                success: false,
                message: `Your Booking is Already ${bookingFound.bookingStatus}`
            }
        };
        const now = new Date();

        if (bookingFound.bookingStatus === "confirmed") {
            await db.transaction(async (tx) => {
                await tx.update(bookings).set({
                    bookingStatus: "cancelled",
                    cancelledAt: now,
                    holdExpiresAt: now,
                }).where(and(
                    eq(bookings.userId, dbuser.userId),
                    eq(bookings.id, bookingFound.id)
                ));

                if (bookingFound.rewardGranted) {
                    await tx.update(profiles).set({
                        rewardPoints: Math.max(0, Number(profiles.rewardPoints) - 65)
                    });
                };

                await tx.delete(bookingStations).where(and(
                    eq(bookingStations.bookingId, bookingFound.id)
                ));
            });
            return {
                success: true,
                message: "Booking Cancelled"
            }
        }
        else {
            await db.transaction(async (tx) => {
                await tx.update(bookings).set({
                    bookingStatus: "cancelled",
                    cancelledAt: now,
                    holdExpiresAt: now
                }).where(and(
                    eq(bookings.id, bookingFound.id),
                    eq(bookings.userId, dbuser.userId),
                    inArray(bookings.bookingStatus, ["hold", "pending"])
                ));

                await tx.delete(bookingStations).where(eq(bookingStations.bookingId, bookingFound.id));
            });

            return {
                success: true,
                message: "Booking Cancelled"
            }
        }
    }
    catch (err) {
        console.error("[cancelBooking]: ", err);
        return {
            success: false,
            message: "Something Went Wrong"
        }
    }
}

export const verifyPayment = async (input: VerifySignatureInput): Promise<{
    success: boolean;
    message?: string;
    data?: {
        bookingId: string;
        date: string;
        startTime: string;
        endTime: string;
        players: string | number;
        deviceName: string;
        deviceType: string | typeof devices.type;
        paidAmount: string | number;
        currentPoints: string | number;
        rewardMessage?: string;
    }
}> => {
    try {
        const { error: zoderror, data: parsedInput } = verifyPaymentSchema.safeParse(input);
        if (zoderror) return { success: false, message: zoderror.message };

        //Authentication check
        const { error: authError, dbuser } = await resolveAuthenticatedUser("user");
        if (authError) return authError;

        //OwnerShip Check
        const [bookingresponse] = await db.select({
            booking: bookings,
            device: {
                name: devices.deviceName,
                type: devices.type
            },
            userPoints: profiles.rewardPoints
        })
            .from(bookings)
            .where(and(
                eq(bookings.id, parsedInput.bookingId),
                eq(bookings.userId, dbuser.userId)
            ))
            .innerJoin(bookingStations, eq(bookingStations.bookingId, bookings.id))
            .innerJoin(gameStations, eq(bookingStations.gameStationId, gameStations.id))
            .innerJoin(devices, eq(gameStations.deviceId, devices.id))
            .innerJoin(profiles, eq(bookings.userId, profiles.id));

        if (!bookingresponse) {
            return {
                success: false,
                message: "Booking Not Found"
            }
        };
        if (bookingresponse.booking.bookingStatus === "confirmed") {
            return {
                success: true,
                message: "Booking Already CONFIRMED",
                data: {
                    bookingId: bookingresponse.booking.id,
                    deviceName: bookingresponse.device.name,
                    deviceType: bookingresponse.device.type,
                    players: bookingresponse.booking.playersCount,
                    paidAmount: bookingresponse.booking.paidAmount!,
                    date: formatToNormalDate(bookingresponse.booking.startTime),
                    startTime: formatToNormalTime(bookingresponse.booking.startTime),
                    endTime: formatToNormalTime(bookingresponse.booking.endTime),
                    currentPoints: bookingresponse.userPoints
                }
            }
        };
        if (bookingresponse.booking.bookingStatus !== "pending") {
            return {
                success: false,
                message: `Invalid bookingStatus - ${bookingresponse.booking.bookingStatus}`
            }
        };
        const storedOrderId = bookingresponse.booking.razorpayOrderId;

        if (!storedOrderId || storedOrderId !== parsedInput.razorpay_order_id) {
            return {
                success: false,
                message: "Payment order does not match this booking"
            };
        }

        const isPaymentSuccessfull = validatePaymentVerification({
            order_id: bookingresponse.booking.razorpayOrderId!,
            payment_id: parsedInput.razorpay_payment_id
        }, parsedInput.razorpay_signature, process.env.RAZORPAY_SECRET!);

        if (!isPaymentSuccessfull) {
            return {
                success: false,
                message: "Payment Failed"
            }
        };

        const [updatedBooking] = await db.update(bookings).set({
            bookingStatus: "confirmed",
            paidAmount: bookingresponse.booking.totalAmount,
            razorpayPaymentId: parsedInput.razorpay_payment_id
        }).where(and(
            eq(bookings.id, bookingresponse.booking.id),
            eq(bookings.userId, dbuser.userId)
        )).returning();

        const { currentPoints, success: addpointSuccess, message: addpointMessage } = await addPoints(dbuser.userId, updatedBooking.id);
        const pointsToSendInResponse = addpointSuccess ? currentPoints : bookingresponse.userPoints;
        return {
            success: true,
            data: {
                bookingId: updatedBooking.id,
                paidAmount: updatedBooking.paidAmount!,
                deviceName: bookingresponse.device.name,
                deviceType: bookingresponse.device.type,
                date: formatToNormalDate(updatedBooking.startTime),
                startTime: formatToNormalTime(updatedBooking.startTime),
                endTime: formatToNormalTime(updatedBooking.endTime),
                players: updatedBooking.playersCount,
                currentPoints: pointsToSendInResponse!,
                rewardMessage: addpointSuccess ? undefined : addpointMessage
            }
        }
    }
    catch (err) {
        console.error("[verifyPayment]: ", err);
        return {
            success: false,
            message: "Something Went Wrong while verifying payment"
        }
    }
};