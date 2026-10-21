export interface Donation{
    donationId?:number;
    userId:number;
    charityId:number;
    amount: number;
    donationDate:Date;
}