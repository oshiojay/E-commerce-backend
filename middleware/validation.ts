import joi from "joi"
import type { NextFunction, Request, Response } from "express"

const handleValidationError = (res: Response, error: joi.ValidationError) => {
    return res.status(400).json({
        message: error.details.map((detail) => detail.message)
    });
};

export const clientReg = (req: Request, res: Response, next: NextFunction) => {
    const schema = joi.object({
        fullName: joi.string().trim().min(4).pattern(/^[A-Za-z\s-]+$/).required().messages({
            'any.required': 'fullName is required',
            'string.empty': 'fullName cannot be empty',
            'string.min': 'fullName must be at least 4 characters',
            'string.pattern.base': 'fullName cannot contain numbers and may only include letters, spaces, and hyphens'
        }),
        email: joi.string().trim().lowercase().email().required().messages({
            'any.required': 'Email is required',
            'string.empty': 'Email cannot be empty',
            'string.email': 'Email must be a valid email'
        }),
        password: joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#^()_\-+=])[A-Za-z\d@$!%*?&.#^()_\-+=]+$/).required().messages({
            'any.required': 'Password is required',
            'string.empty': 'Password cannot be empty',
            'string.min': 'Password must be at least 8 characters',
            'string.pattern.base': 'Password must include at least one uppercase, one lowercase, one digit and one special character'
        }),
        phoneNumber: joi.string().trim().pattern(/^\d{7,15}$/).required().messages({
            'any.required': 'Phone number is required',
            'string.empty': 'Phone number cannot be empty',
            'string.pattern.base': 'Phone number must contain 7 to 15 digits'
        }),
    })

    const { error, value } = schema.validate(req.body, { abortEarly: false, convert: true });

    if (error) {
        return handleValidationError(res, error);
    }

    req.body = value;
    next();
};

export const verifyUserValidation = (req: Request, res: Response, next: NextFunction) => {
    const schema = joi.object({
        email: joi.string().trim().lowercase().email().required().messages({
            'any.required': 'Email is required',
            'string.empty': 'Email cannot be empty',
            'string.email': 'Email must be a valid email'
        }),
        otp: joi.string().trim().length(6).pattern(/^\d+$/).required().messages({
            'any.required': 'OTP is required',
            'string.empty': 'OTP cannot be empty',
            'string.length': 'OTP must be exactly 6 digits',
            'string.pattern.base': 'OTP must contain only digits'
        })
    });

    const { error, value } = schema.validate(req.body, { abortEarly: false, convert: true });

    if (error) {
        return handleValidationError(res, error);
    }

    req.body = value;
    next();
};

export const loginValidation = (req: Request, res: Response, next: NextFunction) => {
    const schema = joi.object({
        email: joi.string().trim().lowercase().email().required().messages({
            'any.required': 'Email is required',
            'string.empty': 'Email cannot be empty',
            'string.email': 'Email must be a valid email'
        }),
        password: joi.string().trim().min(8).required().messages({
            'any.required': 'Password is required',
            'string.empty': 'Password cannot be empty',
            'string.min': 'Password must be at least 8 characters'
        })
    });

    const { error, value } = schema.validate(req.body, { abortEarly: false, convert: true });

    if (error) {
        return handleValidationError(res, error);
    }

    req.body = value;
    next();
};

export const resendOtpValidation = (req: Request, res: Response, next: NextFunction) => {
    const schema = joi.object({
        email: joi.string().trim().lowercase().email().required().messages({
            'any.required': 'Email is required',
            'string.empty': 'Email cannot be empty',
            'string.email': 'Email must be a valid email'
        })
    });

    const { error, value } = schema.validate(req.body, { abortEarly: false, convert: true });

    if (error) {
        return handleValidationError(res, error);
    }

    req.body = value;
    next();
};

export const forgotPasswordValidation = (req: Request, res: Response, next: NextFunction) => {
    const schema = joi.object({
        email: joi.string().trim().lowercase().email().required().messages({
            'any.required': 'Email is required',
            'string.empty': 'Email cannot be empty',
            'string.email': 'Email must be a valid email'
        })
    });

    const { error, value } = schema.validate(req.body, { abortEarly: false, convert: true });

    if (error) {
        return handleValidationError(res, error);
    }

    req.body = value;
    next();
};

export const resetPasswordValidation = (req: Request, res: Response, next: NextFunction) => {
    const schema = joi.object({
        email: joi.string().trim().lowercase().email().required().messages({
            'any.required': 'Email is required',
            'string.empty': 'Email cannot be empty',
            'string.email': 'Email must be a valid email'
        }),
        password: joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#^()_\-+=])[A-Za-z\d@$!%*?&.#^()_\-+=]+$/).required().messages({
            'any.required': 'Password is required',
            'string.empty': 'Password cannot be empty',
            'string.min': 'Password must be at least 8 characters',
            'string.pattern.base': 'Password must include at least one uppercase, one lowercase, one digit and one special character'
        })
    });

    const { error, value } = schema.validate(req.body, { abortEarly: false, convert: true });

    if (error) {
        return handleValidationError(res, error);
    }

    req.body = value;
    next();
};

export const changePasswordValidation = (req: Request, res: Response, next: NextFunction) => {
    const schema = joi.object({
        oldPassword: joi.string().min(8).required().messages({
            'any.required': 'Old password is required',
            'string.empty': 'Old password cannot be empty',
            'string.min': 'Old password must be at least 8 characters'
        }),
        newPassword: joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#^()_\-+=])[A-Za-z\d@$!%*?&.#^()_\-+=]+$/).required().messages({
            'any.required': 'New password is required',
            'string.empty': 'New password cannot be empty',
            'string.min': 'New password must be at least 8 characters',
            'string.pattern.base': 'New password must include at least one uppercase, one lowercase, one digit and one special character'
        })
    });

    const { error, value } = schema.validate(req.body, { abortEarly: false, convert: true });

    if (error) {
        return handleValidationError(res, error);
    }

    req.body = value;
    next();
};

export const createAdminValidation = (req: Request, res: Response, next: NextFunction) => {
    const schema = joi.object({
        name: joi.string().trim().min(4).pattern(/^[A-Za-z\s.'-]+$/).required().messages({
            'any.required': 'Name is required',
            'string.empty': 'Name cannot be empty',
            'string.min': 'Name must be at least 4 characters',
            'string.pattern.base': 'Name may only include letters, spaces, periods, apostrophes, and hyphens'
        }),
        storeName: joi.string().trim().min(2).max(100).required().messages({
            'any.required': 'Store name is required',
            'string.empty': 'Store name cannot be empty',
            'string.min': 'Store name must be at least 2 characters',
            'string.max': 'Store name must be at most 100 characters'
        }),
        phoneNumber: joi.string().trim().pattern(/^\d{7,15}$/).required().messages({
            'any.required': 'Phone number is required',
            'string.empty': 'Phone number cannot be empty',
            'string.pattern.base': 'Phone number must contain 7 to 15 digits'
        }),
        email: joi.string().trim().lowercase().email().required().messages({
            'any.required': 'Email is required',
            'string.empty': 'Email cannot be empty',
            'string.email': 'Email must be a valid email'
        }),
        password: joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#^()_\-+=])[A-Za-z\d@$!%*?&.#^()_\-+=]+$/).required().messages({
            'any.required': 'Password is required',
            'string.empty': 'Password cannot be empty',
            'string.min': 'Password must be at least 8 characters',
            'string.pattern.base': 'Password must include at least one uppercase, one lowercase, one digit and one special character'
        })
    });

    const { error, value } = schema.validate(req.body, { abortEarly: false, convert: true });

    if (error) {
        return handleValidationError(res, error);
    }

    req.body = value;
    next();
};

export const createProductValidation = (req: Request, res: Response, next: NextFunction) => {
    const schema = joi.object({
        productTitle: joi.string().trim().min(3).max(100).required().messages({
            'any.required': 'Product title is required',
            'string.empty': 'Product title cannot be empty',
            'string.min': 'Product title must be at least 3 characters',
            'string.max': 'Product title must be at most 100 characters'
        }),
        category: joi.string().valid('Health', 'Audio', 'Living', 'Wearables', 'DeskSetupAndPeripherals').required().messages({
            'any.required': 'Category is required',
            'string.empty': 'Category cannot be empty',
            'any.only': 'Category must be one of Health, Audio, Living, Wearables, or DeskSetupAndPeripherals'
        }),
        description: joi.string().trim().min(10).max(1000).required().messages({
            'any.required': 'Description is required',
            'string.empty': 'Description cannot be empty',
            'string.min': 'Description must be at least 10 characters',
            'string.max': 'Description must be at most 1000 characters'
        }),
        quantity: joi.number().integer().min(1).required().messages({
            'any.required': 'Quantity is required',
            'number.base': 'Quantity must be a number',
            'number.integer': 'Quantity must be a whole number',
            'number.min': 'Quantity must be at least 1'
        }),
        colour: joi.string().trim().min(2).pattern(/^[A-Za-z\s-]+$/).required().messages({
            'any.required': 'Colour is required',
            'string.empty': 'Colour cannot be empty',
            'string.min': 'Colour must be at least 2 characters',
            'string.pattern.base': 'Colour can only contain letters, spaces, and hyphens'
        }),
        price: joi.number().integer().min(1).required().messages({
            'any.required': 'Price is required',
            'number.base': 'Price must be a number',
            'number.integer': 'Price must be a whole number',
            'number.min': 'Price must be at least 1'
        })
    });

    const { error, value } = schema.validate(req.body, { abortEarly: false, convert: true });

    if (error) {
        return handleValidationError(res, error);
    }

    req.body = value;
    next();
};

export const addToCartValidation = (req: Request, res: Response, next: NextFunction) => {
    const schema = joi.object({
        quantity: joi.number().integer().min(1).required().messages({
            'any.required': 'Quantity is required',
            'number.base': 'Quantity must be a number',
            'number.integer': 'Quantity must be a whole number',
            'number.min': 'Quantity must be at least 1'
        })
    }).required();

    const { error, value } = schema.validate(req.body, { abortEarly: false, convert: true });

    if (error) {
        return handleValidationError(res, error);
    }

    req.body = value;
    next();
};

export const updateCartItemValidation = (req: Request, res: Response, next: NextFunction) => {
    const schema = joi.object({
        quantity: joi.number().integer().min(0).required().messages({
            'any.required': 'Quantity is required',
            'number.base': 'Quantity must be a number',
            'number.integer': 'Quantity must be a whole number',
            'number.min': 'Quantity cannot be negative'
        })
    });

    const { error, value } = schema.validate(req.body, { abortEarly: false, convert: true });

    if (error) {
        return handleValidationError(res, error);
    }

    req.body = value;
    next();
};

export const cartProductIdValidation = (req: Request, res: Response, next: NextFunction) => {
    const schema = joi.object({
        productId: joi.string().guid({ version: ['uuidv4'] }).required().messages({
            'any.required': 'Product ID is required',
            'string.guid': 'Product ID must be a valid UUID'
        })
    });

    const { error } = schema.validate(req.params, { abortEarly: false });

    if (error) {
        return handleValidationError(res, error);
    }

    next();
};

export const cartItemIdValidation = (req: Request, res: Response, next: NextFunction) => {
    const schema = joi.object({
        itemId: joi.string().guid({ version: ['uuidv4'] }).required().messages({
            'any.required': 'Cart item ID is required',
            'string.guid': 'Cart item ID must be a valid UUID'
        })
    });

    const { error } = schema.validate(req.params, { abortEarly: false });

    if (error) {
        return handleValidationError(res, error);
    }

    next();
};