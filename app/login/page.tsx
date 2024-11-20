import FormButton from "@/components/form-button";
import FormInput from "@/components/form-input";
import SocialLogin from "@/components/social-login";

export default function LogIn() {
    const handleForm = async (formData: FormData) => {
        "use server";
        await new Promise(res => setTimeout(res, 5000));
        console.log("i run in the server!");
    }
    return (
        <div className="flex flex-col gap-10 py-8 px-6">
            <div className="flex flex-col gap-2 
            *:font-medium">
                <h1 className="text-2xl">안녕하세요!</h1>
                <h2 className="text-xl">Log in with email and password.
                </h2>
            </div>
            <form action={handleForm} className="flex flex-col gap-3">
                <FormInput
                    name="email"
                    type="email"
                    placeholder="Email"
                    errors={[]}
                    required
                />
                <FormInput
                    name="password"
                    type="password"
                    placeholder="Password"
                    errors={[]}
                    required
                />
                <FormButton text="Log in" />
            </form>
            <SocialLogin />
        </div>
    )
}