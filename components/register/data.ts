export  interface RegisterData {
    currentPage : Number,
    isLoading: boolean, 
    setLoading: (loading: boolean) => void 
    next: () =>  void 

    
    name: string;
    email: string;
    password: string;
    confirmPassword: string;

    setName: (name: string) => void;
    setEmail: (email: string) => void;
    setPassword: (password: string) => void;
    setConfirmPassword: (confirmPassword: string) => void;
}