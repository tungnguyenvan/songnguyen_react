import IBaseDocument from "@app/framework/interfaces/IBaseDocument";

/**
 * Customer document
 * @author tung.nguyenvan
 */
interface ICustomerDocument extends IBaseDocument {
    name: string;
    address: string;
    tax: string;
    email: string;
    phone_number: string;
    contact_name: string;
}

export default ICustomerDocument;
