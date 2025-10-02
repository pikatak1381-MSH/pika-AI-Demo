import Image from "next/image"


const PhoneNumberForm = () => {
  return (
    <div
        className="w-full flex justify-between items-center rounded-2xl bg-[#1f1f1f] max-w-[446px] px-3 py-2"
    >
        <label className="text-nowrap text-[1.125rem] font-semibold" htmlFor="phone-number">شماره تماس</label>
        <input className="w-full mx-7 px-2 py-1" type="tel" id="phone-number" name="phone-number" pattern="[0-9]*" inputMode="numeric" required />
        <Image
            className="object-cover w-5 h-5"
            src="/phone-icon.png"
            alt=""
            width={20}
            height={20}
        />
    </div>
  )
}

export default PhoneNumberForm