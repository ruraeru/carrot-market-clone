"use client";

import FormButton from "@/components/form-button";
import FormInput from "@/components/form-input";
import SocialLogin from "@/components/social-login";

export default function Login() {
    const onClick = async () => {
        const response = await fetch("/api/users", {
            method: "POST",
            body: JSON.stringify({
                username: "nico",
                password: "1234"
            })
        })
        console.log(await response.json());
    }
    return (
        <div className="flex flex-col gap-10 py-8 px-6">
            <div className="flex flex-col gap-2 
            *:font-medium">
                <h1 className="text-2xl">안녕하세요!</h1>
                <h2 className="text-xl">Log in with email and password.
                </h2>
            </div>
            <form className="flex flex-col gap-3">
                <FormInput
                    type="email"
                    placeholder="Email"
                    errors={[]}
                    required
                />
                <FormInput
                    type="password"
                    placeholder="Password"
                    errors={[]}
                    required
                />
            </form>
            <span onClick={onClick}>
                <FormButton loading={false} text="Log in" />
            </span>
            <SocialLogin />
        </div>
    )
}