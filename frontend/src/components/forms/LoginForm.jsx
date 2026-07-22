import { useState } from "react";
import { Eye, EyeOff } from "lucide-react"; 
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../../validations/auth.schema";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  // 1. Hook Form Setup with Zod
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting } 
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: "onTouched" // UX Masterstroke: Focus hatne par validation hogi
  });

  // 2. Mock API Call
  const onSubmit = async (data) => {
    console.log('Zod ne pass kar diya. RHF data: ', data);
    // Fake 2-second delay dikhane ke liye ki loading kaise chalega
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  return (
    <div className="flex justify-center mt-10">
      <div className="card w-96 bg-base-100 shadow-xl border border-base-300">
        <div className="card-body">
          <h2 className="text-center text-2xl font-bold mb-4">Login to DevTinder 🔥</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            {/* --- EMAIL FIELD GROUP --- */}
            <div className="form-control w-full">
              <label htmlFor="login-email" className="label mb-0.5">
                <span className="label-text font-semibold">Email Id</span>
              </label>
              <input 
                id="login-email"
                type="email"
                placeholder="dev@email.com"
                // 3. Dynamic Error Class: Agar email me error hai toh 'input-error' class lagao
                className={`input input-bordered w-full ${errors.email ? "input-error" : ""}`}
                {...register('email')}
              />
              {/* 4. Error Message UI */}
              {errors.email && (
                <label className="label">
                  <span className="label-text-alt text-error font-medium">
                    {errors.email.message}
                  </span>
                </label>
              )}
            </div>

            {/* --- PASSWORD FIELD GROUP --- */}
            <div className="form-control w-full">
              <label htmlFor="login-password" className="label mb-0.5">
                <span className="label-text font-semibold">Password</span>
              </label>
              
              <div className="relative">
                <input 
                  id="login-password"
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••"
                  className={`input input-bordered w-full pr-10 ${errors.password ? "input-error" : ""}`}
                  {...register('password')}
                />
                
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              
              {/* Password Error Message UI */}
              {errors.password && (
                <label className="label">
                  <span className="label-text-alt text-error font-medium">
                    {errors.password.message}
                  </span>
                </label>
              )}
            </div>

            {/* --- SUBMIT BUTTON --- */}
            <div className="form-control mt-8">
              <button 
                type="submit" 
                className="btn btn-primary w-full"
                disabled={isSubmitting} // Network request ke time disable
              >
                {/* 5. Loading Spinner Logic */}
                {isSubmitting ? (
                  <>
                    <span className="loading loading-spinner"></span>
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}