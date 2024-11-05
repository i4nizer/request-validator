declare module '@i4nizer/request-validator' {
    interface Field {
        name: string;
        min?: number;
        max?: number;
        pattern?: RegExp;
        required?: boolean;
    }

    interface RequestValidator {
        getMissingFields: (fields: Field[], obj: object) => string[];
        validateStringField: (field: Field, value: string) => string | null;
        validateNumberField: (field: Field, value: number) => string | null;
        validateField: (field: Field, value: any) => string | null;
        validateRequest: (
            fields: Field[],
            obj: object,
            res: { status: (code: number) => { send: (message: string) => void } }
        ) => boolean;
    }

    const requestValidator: RequestValidator;
    export = requestValidator;
}
