import passport  from "passport";
import localStrategy from "passport-local"
import Sequelize from "../models/index.js";
import bcrypt from "bcrypt";
export default () => {
  passport.use(
    new localStrategy.Strategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email, password, done) => {
        try {
          const exUser = await Sequelize.User.findOne({ where: { email } });
          if (exUser) {
            const result = await bcrypt.compare(password, exUser.password);
            if (result) {
              done(null, exUser);
            } else {
              done(null, false, { message: "비밀번호가 일치하지 않습니다" });
            }
          } else {
            done(null, false, { message: "가입되지 않은 회원 입니다" });
          }
        } catch (error) {
          done(err);
        }
      }
    )
  );
};
