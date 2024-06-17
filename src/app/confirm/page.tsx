"use client";
import React from "react";
import { useSearchParams } from "next/navigation";
import { Swrgetdat } from "@/libs/hooks/Swrgetdat";
const Confirm = () => {
  const serachparams = useSearchParams();
  const token = serachparams.get("token");
  const url = `/api/users/confirm?token=${token}`;
  const { data, error, isLoading } = Swrgetdat(url);
  const datamessage = (
    <div className="flex justify-center flex-col gap-[16px] items-center">
      <h1 className="text-[32px] text-[#000]">
        Succefully Confirmed your email{" "}
      </h1>
      <a
        className="text-[#000] text-[18px] underline hover:opacity-[0.8]"
        href="/sign-in"
      >
        Login In here
      </a>
    </div>
  );

  const errormessage = (
    <div className="flex justify-center flex-col gap-[16px] items-center">
      <h1 className="text-[32px] text-[#000]">
        Sorry we could not confirm you, kindly sign in again to receive a
        confirmation email{" "}
      </h1>
      <a
        className="text-[#000] text-[18px] underline hover:opacity-[0.8]"
        href="/sign-up"
      >
        Sign In here
      </a>
    </div>
  );

  const loadingmessage = (
    <div className="flex justify-center flex-col gap-[16px] items-center">
      <h1 className="text-[32px] text-[#000]">Loading...</h1>
    </div>
  );
  return (
    <section>
      {data ? datamessage : isLoading ? loadingmessage : errormessage}
    </section>
  );
};

export default Confirm;
