interface Action {
  type: string;
}
export const userReducer = (state = null, action: Action) => {
  switch (action.type) {
    case "SIGN_UP":
      return "HIHIH";
  }
};
