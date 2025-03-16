export interface IVerifyOTPUsecase {
    execute({email , otp} : {email : string , otp : string}) : Promise<void>
}