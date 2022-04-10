import * as jwt from 'jsonwebtoken';
import * as fs from 'fs';
// import ITokenVerify from '../interfaces/TokenVerify';

const jwtKey = () => fs.readFileSync('./jwt.evaluation.key', 'utf8');

export default class Token {
  public static verify(token : string) : string | jwt.JwtPayload | false {
    try {
      const SECRET = jwtKey();
      const payload = jwt.verify(token, SECRET);
      return payload;
    } catch (err) {
      return false;
    }
    // return true;
  }

  public static create(data: object) : string {
    const SECRET = jwtKey();
    const token: string = jwt.sign({ data }, SECRET);
    return token;
  }
}
