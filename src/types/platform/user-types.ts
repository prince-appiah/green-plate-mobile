interface IBaseUser {
  id: string;
  email: string;
  name: string;
  // role: IUserRole;
}

interface ICustomer extends IBaseUser {
  preferences: {
    language: string;
    currency: string;
  };
}

interface IRestaurant extends IBaseUser {
  address: string;
}
