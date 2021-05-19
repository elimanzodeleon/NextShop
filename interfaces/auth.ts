export interface ILoginForm {
  email: string;
  password: string;
}

export interface ISignUpForm extends ILoginForm {
  confirmPassword: string;
}
