import ChangePasswordForm from "../auth/ChangePasswordForm"

const SectionAccount = () => {
  return (
    <div>
        <h2 className="text-lg font-medium text-nowrap">حساب کاربری</h2>
        <hr className="my-2"/>

        <div
          className="py-4"
        >
          <h3
            className="pb-6"
          >
            تغییر رمز عبور
          </h3>
          <ChangePasswordForm />
        </div>
    </div>
  )
}

export default SectionAccount