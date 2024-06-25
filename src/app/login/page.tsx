import { LoginForm } from "@/components/LoginForm";

export default async function Page() {

  return (
    // <section>
    //   <div>{user ? <SignOut>{`Welcome ${user}`}</SignOut> : <SignIn />}</div>
    // </section>
    <LoginForm/>
  );
}
