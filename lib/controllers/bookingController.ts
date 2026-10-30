"use server";
import { db } from "@/src/index";
import { bookingItems, bookings, devices, foodItems, gameStations, profiles } from "@/src/db/schema";
import { eq, and, gte, lt, asc, desc, inArray, gt } from "drizzle-orm";
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
            .innerJoin(gameStations, eq(bookings.gameStationId, gameStations.id))
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
            .innerJoin(gameStations, eq(bookings.gameStationId, gameStations.id))
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
        const foodItemsArray = result[0].foodName ? result.map((r) => ({
            name: r.foodName!,
            unitPrice: r.foodPrice!,
            qty: r.foodQty!
        })) : [];

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
}

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

        const [bookedStationcheck] = await db.select({
            stationId: gameStations.id,
            maxPlayers: devices.maxPlayers,
            hourlyRate: devices.hourlyRate,
            isActive: gameStations.isActive,
        }).from(gameStations)
            .innerJoin(devices, eq(gameStations.deviceId, devices.id))
            .where(and(
                eq(gameStations.id, parsed.gameStationId),
                eq(gameStations.isActive, true)
            ))
        if (!bookedStationcheck) {
            return {
                success: false,
                message: "NO STATIONS AVAILABLE"
            }
        };
        if (parsed.playersCount > bookedStationcheck.maxPlayers) {
            return {
                success: false,
                message: `You can choose max ${bookedStationcheck.maxPlayers} players for this device`
            }
        };
        if (parsed.playersCount <= 0) {
            return {
                success: false,
                message: "Choose Atleast one player"
            }
        }
        //Calculate price
        // Base price = duration * hourlyRate
        const totalAmount = (durationInHours * Number(bookedStationcheck.hourlyRate) * Number(parsed.playersCount)).toFixed(2);
        //Run cleanup & Insert new booking with hold
        const holdExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
        const newBooking = await db.transaction(async (tx) => {
            await tx.update(bookings)
                .set({ bookingStatus: "cancelled" })
                .where(and(
                    inArray(bookings.bookingStatus, ["hold", "pending"]),
                    lt(bookings.holdExpiresAt, now)
                ));
                
            const [insertedData] = await tx.insert(bookings).values({
                gameStationId: bookedStationcheck.stationId,
                endTime: convertedEndTime,
                startTime: convertedStartTime,
                totalAmount: totalAmount,
                userId: dbuser.userId,
                bookingStatus: "hold",
                holdExpiresAt: holdExpiresAt,
                playersCount: parsed.playersCount
            }).returning();

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
        }
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
            .innerJoin(gameStations, eq(bookings.gameStationId, gameStations.id))
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