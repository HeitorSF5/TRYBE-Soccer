export default interface ITokenFormat {
  data: {
    email: string;
    role: string;
    id: number;
    username: string;
  }
  iat: number;
}
