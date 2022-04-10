import * as bcrypt from 'bcryptjs';
// https://www.npmjs.com/package/bcryptjs
import PassHash from '../interfaces/PassHash';

const verifyAuth = ({ password, hash } : PassHash) : boolean => bcrypt.compareSync(password, hash);

export default { verifyAuth };
