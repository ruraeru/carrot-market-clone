"use client"

import FormButton from "@/components/form-button";
import FormInput from "@/components/form-input";
import SocialLogin from "@/components/social-login";
import { useFormState } from "react-dom";
import { handleForm } from "./actions";

export default function LogIn() {
    //useFormState => handleForm(null) return state => call again action 
    //=> handleForm(prevState) return PrevState
    const [state, action] = useFormState(handleForm, null);
    return (
        <div className="flex flex-col gap-10 py-8 px-6">
            <div className="flex flex-col gap-2 
            *:font-medium">
                <h1 className="text-2xl">안녕하세요!</h1>
                <h2 className="text-xl">Log in with email and password.
                </h2>
            </div>
            <form action={action} className="flex flex-col gap-3">
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
                    errors={state?.errors ?? []}
                    required
                />
                <FormButton text="Log in" />
            </form>
            <SocialLogin />
        </div>
    )
}