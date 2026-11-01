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
        })
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