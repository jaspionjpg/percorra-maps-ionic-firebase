export class User {
    
    public $key: string
    
    constructor(
        public username: string,
        public email: string,
        public photo: string,
    ){}
}