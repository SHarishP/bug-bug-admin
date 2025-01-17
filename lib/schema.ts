import { object, string, InferType } from "yup";

interface IValidationMessage {
  userName: {
    notEmpty: string;
    length: string;
  };
  userEmail: {
    notEmpty: string;
    isEmail: string;
  };
  password: {
    notEmpty: string;
    format: string;
  };
  productName: {
    notEmpty: string;
    length: string;
  };
  productDesc: {
    length: string;
  };
  categoryName: {
    notEmpty: string;
    length: string;
  };
  insightName: {
    notEmpty: string;
    length: string;
  };
  custName: {
    notEmpty: string;
    length: string;
  };
  custPosition: {
    notEmpty: string;
    length: string;
  };
  custComment: {
    notEmpty: string;
    length: string;
  };
}

const ValidationMessage: IValidationMessage = {
  userName: {
    notEmpty: "Name is required",
    length: "Name must be 3 characters minimum and 30 characters maximum!",
  },
  userEmail: {
    notEmpty: "Email is required",
    isEmail: "Invalid email address",
  },
  password: {
    notEmpty: "Password is required",
    format:
      "Password need to have atleast 6 characters with 1 Uppercase and 1 Special character",
  },
  productName: {
    notEmpty: "Product name is required",
    length:
      "Product name must be 3 characters minimum and 30 characters maximum!",
  },
  productDesc: {
    length: "Product description must be 200 characters maximum!",
  },
  categoryName: {
    notEmpty: "Category name is required",
    length:
      "Product name must be 3 characters minimum and 30 characters maximum!",
  },
  insightName: {
    notEmpty: "Insight title is required",
    length:
      "Insight title must be 3 characters minimum and 200 characters maximum!",
  },
  custName: {
    notEmpty: "Customer name is required",
    length:
      "Customer name must be 3 characters minimum and 30 characters maximum!",
  },
  custPosition: {
    notEmpty: "Customer position is required",
    length:
      "Customer position must be 3 characters minimum and 50 characters maximum!",
  },
  custComment: {
    notEmpty: "Cutommer testimonial is required",
    length: "Customer testimonial must be 200 characters maximum!",
  },
};

export const RegisterSchema = object({
  name: string()
    .required(ValidationMessage.userName.notEmpty)
    .min(3, ValidationMessage.userName.length)
    .max(30, ValidationMessage.userName.length),
  email: string()
    .email(ValidationMessage.userEmail.isEmail)
    .required(ValidationMessage.userEmail.notEmpty),
  password: string()
    .required(ValidationMessage.password.notEmpty)
    .matches(
      /^(?=.*[\d])(?=.*[A-Z])(?=.*[!@#$%^&*])[\w!@#$%^&*]{6,16}$/,
      ValidationMessage.password.format
    ),
});

export const LoginSchema = object({
  email: string()
    .email(ValidationMessage.userEmail.isEmail)
    .required(ValidationMessage.userEmail.notEmpty),
  password: string().required(ValidationMessage.password.notEmpty),
});

export const ProductSchema = object({
  name: string()
    .required(ValidationMessage.productName.notEmpty)
    .min(3, ValidationMessage.productName.length)
    .max(200, ValidationMessage.productName.length),
  desc: string().max(200, ValidationMessage.productDesc.length),
});

export const CategorySchema = object({
  name: string()
    .required(ValidationMessage.categoryName.notEmpty)
    .min(3, ValidationMessage.categoryName.length)
    .max(30, ValidationMessage.categoryName.length),
});

export const InsightSchema = object({
  name: string()
    .required(ValidationMessage.insightName.notEmpty)
    .min(3, ValidationMessage.insightName.length)
    .max(200, ValidationMessage.insightName.length),
  category: string().required(ValidationMessage.categoryName.notEmpty),
});

export const TestimonialSchema = object({
  customer: string()
    .required(ValidationMessage.custName.notEmpty)
    .min(3, ValidationMessage.custName.length)
    .max(30, ValidationMessage.custName.length),
  position: string()
    .required(ValidationMessage.custPosition.notEmpty)
    .min(3, ValidationMessage.custPosition.length)
    .max(50, ValidationMessage.custPosition.length),
  comment: string()
    .required(ValidationMessage.custComment.notEmpty)
    .max(200, ValidationMessage.custComment.length),
});
export interface IRegisterSchema extends InferType<typeof RegisterSchema> {}
