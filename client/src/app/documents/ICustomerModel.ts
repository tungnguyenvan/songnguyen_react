import IBaseModel from "framework/documents/models/IBaseModel";

interface ICustomerModel extends IBaseModel {
    name: string;
    address: string;
    tax: string;
    email: string;
    phone_number: string;
    contact_name: string;
}

export default ICustomerModel;
