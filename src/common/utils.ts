import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';

export const checkPassword = async (
  password: string,
  user: Partial<User>,
): Promise<boolean> => {
  try {
    const ok = await bcrypt.compare(password, user.password);
    return ok;
  } catch (e) {
    console.log(e);
  }
};
