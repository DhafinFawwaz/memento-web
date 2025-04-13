import { termsAndConditions } from "@/components/data";

export default function Term() {
    return <>
    <div className="w-screen bg-slate-200 flex justify-center">
        <div className="bg-slate-50 py-8 px-4 sm:px-8 max-w-3xl sm:my-8 sm:rounded-2xl">
            {termsAndConditions}
        </div>

    </div>
    
    </>
}