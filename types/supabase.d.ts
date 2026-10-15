import { AccountType } from "@/types/helperTypes";

declare module "@supabase/auth-js" {
    interface UserAppMetadata {
        account_type?: AccountType;
    }
}