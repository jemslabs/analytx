export type signupType = {
    email: String;
    password: String;
    role: String;
}

export type loginType = {
    email: String;
    password: String;
}

export type userType = {
    id: number;
    email: string;
    role: "BRAND" | "CREATOR";
    createdAt: Date;
}


export type useAuthStoreType = {
    user: userType | null;
    signup: (data: signupType) => void;
    login: (data: loginType) => void;
    fetchUser: () => void;
}   

