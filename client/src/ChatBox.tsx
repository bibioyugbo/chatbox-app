import { format, isYesterday, isToday } from "date-fns";
import {useState} from "react";

function formatDate(date: Date): string {
    if (isToday(date)) {
        return `Today at ${format(date, "h:mm a")}`;
    }
    if (isYesterday(date)) {
        return `Yesterday at ${format(date, "h:mm a")}`;
    }
    return format(date, "MMM d, yyyy h:mm a"); // fallback for older dates
}

const options =[
    "Place an order",
    "Checkout order",
    "See order history",
    "See current order",
    "Cancel order"
]

function App() {
    const [timestamp] = useState(new Date());


    return (
    <>
        <div className={"shadow-lg mx-auto flex-col p-5 h-screen max-w-[600px] flex "} >
            <div className="bg-red-600 p-6 rounded-md text-[18px] text-center text-white ">
                <div className={"font-bold"}>FOODLY</div>
                <div className={'text-gray-200 text-[12px]'}>Where all cravings get satisfied</div>
            </div>
            <div className={"rounded-bl-none rounded-2xl my-5 max-w-[400px] p-5 bg-gray-200"}>
                Welcome to FOODLY! How may we serve you today?
                <span className={" justify-end flex text-[12px]"}>{formatDate(timestamp)}</span>
            </div>
            <div className={"grid gap-3 grid-cols-4"}>
                {options.map((item,index)=>(
                    <div key={index} className={"bg-red-300 text-[12px] p-2 text-center hover:shadow-[0_0_15px_rgba(239,68,68,0.8)] hover:brightness-110 cursor-pointer active:scale-105 transition-all duration-300 ease-in-out text-white rounded-[16px] "}>
                        {item}
                    </div>
                ))}

            </div>

        </div>

    </>
  )
}

export default App
