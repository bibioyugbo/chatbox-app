import { format, isYesterday, isToday } from "date-fns";
import BASE_URL from "../apiConfig.ts"
import {type ChangeEvent, useState} from "react";
import { BeatLoader } from "react-spinners";
interface menuType {
    name: string,
    description: string,
    price: string
}
interface orderType {
    orderName:string,
    orderPrice:string
}

type Message = {
    type: "bot" | "user";
    text: React.ReactNode;
};

type botOptions = {
    label: string,
    onClick: () => void
}

const options = [
    "Place an order - 1 ",
    "Checkout order - 99",
    "See order history - 98",
    "See current order - 97",
    "Cancel order - 0"
]

function ChatBox() {
    const [timestamp] = useState(new Date());
    const [value, setValue] = useState("");
    const [isSelectedItem, setIsSelectedItem] = useState(false);
    const [selectedItem, setSelectedItem] = useState(false)
    const [step, setStep] = useState("main");
    const [botOptions, setBotOptions] = useState<botOptions[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [menu, setMenu] = useState<menuType[]>([]);
    const [order, setOrder] = useState<orderType[]>([]);



    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    };

    const handlePlaceOrder =(isSelectedItem)=>{

    }



    const buttonClicked =()=>{
        const input = parseInt(value, 10)
        if (isNaN(input) || value === ""){
            return
        }
        setMessages((prev) => [...prev, { type: "user", text: value }]);
        setBotOptions([])

        if (step === 'main'){
            if (input !== 1 && input !== 99 && input !== 98 && input !== 97 && input !== 0) {
                setMessages((prev) => [...prev, { type: "bot", text: "Must select from options above"}]);
            }
            else{
                switch (input){
                    case 1:
                        placeOrder()
                        setStep("ordering");
                        break;
                    case 99:
                        if (!isSelectedItem) {
                            setBotOptions([
                                { label: "Place an order", onClick: () => handlePlaceOrder(isSelectedItem)},
                            ]);
                        } else {
                            // setBotOptions(["Pay now", "Cancel Order"]);
                        }
                        setMessages((prev) => [...prev,
                        {type: "bot",
                         text:
                             <div className={"flex flex-col gap-3"}>
                                 {!isSelectedItem?
                                     "No order to place.":"Order placed. Proceed to payment?"
                                 }
                             </div>

                        }]);
                        break;
                    case 98:
                        console.log('order history')
                        break;
                    case 97:
                        console.log('current order')
                        break;
                    case 0:
                        console.log('cancel order')
                        break;
                }
            }

        }
        else if (step === 'ordering'){
            if (input === 0) {
                setMessages((prev) => [...prev, { type: "bot", text: "Order canceled ❌" }]);
                setStep("main")
            }
            else if (input === 99) {
                setMessages((prev) => [...prev, { type: "bot", text: "Order placed!" }]);
                // setBotOptions(['Place new order'])
                setStep("main")
            }
            else if (input >= 1 && input <= menu.length){
                const selectedItem = menu[input - 1]
                setSelectedItem(selectedItem)
                setMessages((prev) => [...prev, {
                    type: "bot",
                    text: `You selected ${selectedItem.name} - ${selectedItem.price}`
                }]);
                setIsSelectedItem(true)
                setBotOptions([
                    { label: "Add to cart", onClick: () => addToCart(selectedItem)},
                    { label: "Keep shopping", onClick: () => handlePlaceOrder() },
                    { label: "Main menu", onClick: () => handlePlaceOrder() },
                ]);

            }else {
                setMessages((prev) => [...prev, { type: "bot", text: "Invalid selection. Try again." }]);
            }

        }

        setValue("");
    }

    function formatDate(date: Date): string {
        if (isToday(date)) {
            return `Today at ${format(date, "h:mm a")}`;
        }
        if (isYesterday(date)) {
            return `Yesterday at ${format(date, "h:mm a")}`;
        }
        return format(date, "MMM d, yyyy h:mm a"); // fallback for older dates
    }
    async function addToCart(item:menuType){
        try{
            const response = await fetch(`${BASE_URL}/order`,{
                method:'POST',
                headers:{
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    orderName: item.name,
                    orderPrice: item.price
                })

            })
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            const result = await response.json()
            const orderItem = result.responseData.order
            console.log("Order Item",orderItem)
            setOrder(orderItem)

        }catch (e){
            console.log(e)
        }

    }

    async function placeOrder (){
        try {
            setMessages((prev) => [
                ...prev,
                { type: "bot", text: <BeatLoader /> }
            ]);
            const response = await fetch(`${BASE_URL}/menu`, {
                method:'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            const result = await response.json()
            console.log(result)
            const fetchedMenu = result.responseData.menu
            setMenu(fetchedMenu);
            setMessages((prev) => [
                ...prev.slice(0, -1),
                {
                    type: "bot",
                    text: (
                        <div>
                            <div className="text-red-600 text-center font-bold">
                                FOODLY MENU<br/>
                                <span className="text-gray-500 font-normal mt-3 text-[14px]">
                                   Enter the position of the item you want
                               </span>
                            </div>
                            <div className="mt-3 flex flex-col gap-2">
                                {fetchedMenu.map((item: menuType, i: number) => (
                                    <div
                                        key={i}
                                        className="rounded-md flex justify-between bg-white p-3"
                                    >
                                        <div>
                                            <div>{item.name}</div>
                                            <div className="text-gray-500 text-[14px]">
                                                {item.description}
                                            </div>
                                        </div>
                                        <div>{item.price}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ),
                },
            ]);

        }catch (error) {
            console.error("Error fetching menu:", error);
        }

    }




    return (
    <>
        <div className={"shadow-lg overflow-scroll mx-auto flex-col p-5 h-screen max-w-[600px] flex "} >
            <div className="bg-red-600 p-6 rounded-md text-[18px] text-center text-white ">
                <div className={"font-bold"}>FOODLY</div>
                <div className={'text-gray-200 text-[14px]'}>Where all cravings get satisfied</div>
            </div>
            <div className={"rounded-bl-none  rounded-2xl my-5 max-w-[400px] p-5 bg-gray-200"}>
                Welcome to FOODLY! How may we serve you today?
                <span className={"text-gray-500 mb-3 leading-4 font-normal ml-2 text-[14px]"}>(Enter a number to select an option)</span>
                <span className={" justify-end flex text-[12px]"}>{formatDate(timestamp)}</span>
            </div>
            <div className={"grid gap-3 grid-cols-3"}>
                {options.map((item,index)=>(
                    <div key={index}  className={"bg-red-300 font-bold text-[12px] p-2 text-center hover:shadow-[0_0_15px_rgba(239,68,68,0.8)] hover:brightness-110 cursor-pointer active:scale-105 transition-all duration-300 ease-in-out text-white rounded-[16px] "}>
                        {item}
                    </div>
                ))}
            </div>
            {messages.map((msg, index) => (
                <div
                    key={index}
                    className={`my-2 p-3 w-[400px] rounded-2xl max-w-[400px] ${
                        msg.type === "user"
                            ? "bg-red-600 rounded-br-none text-white self-end"
                            : "bg-gray-200 rounded-bl-none text-black self-start"
                    }`}
                >
                    {msg.text}
                    <span className={" justify-end mt-5 flex text-[12px]"}>{formatDate(timestamp)}</span>

                </div>
            ))}
            {botOptions &&
                <div className={"flex mb-5 gap-3"}>
                    {botOptions.map((option:botOptions, index)=>(
                    <button onClick={option.onClick} key={index}  className={"bg-red-300 font-bold text-[12px] px-4 py-2 text-center hover:shadow-[0_0_15px_rgba(239,68,68,0.8)] hover:brightness-110 cursor-pointer active:scale-105 transition-all duration-300 ease-in-out text-white rounded-[16px] "}>
                        {option.label}
                    </button>
            ))}
                </div>
            }
            {/*<div className="flex  justify-end">*/}
            {/*{optionClicked>-1?*/}
            {/*    <div className={" text-white w-[400px]  flex flex-col rounded-br-none rounded-2xl my-5 p-5 bg-red-600"}>*/}
            {/*        {optionClicked}*/}
            {/*        <span className={" justify-end flex text-[12px]"}>{formatDate(timestamp)}</span>*/}
            {/*    </div>:<div></div>*/}

            {/*}*/}
            {/*</div>*/}
            {/*{loading ? (*/}
            {/*    <div className="rounded-bl-none rounded-2xl my-5 max-w-[400px] p-5 bg-gray-200">*/}
            {/*        <BeatLoader />*/}
            {/*    </div>*/}
            {/*) : menu.length > 0 && (*/}
            {/*    <div className="rounded-bl-none rounded-2xl my-5 max-w-[400px] p-5 bg-gray-200">*/}
            {/*        <div className={"text-red-600 flex flex-col  text-center font-bold"}>*/}
            {/*            FOODLY MENU*/}
            {/*            <span className={"text-gray-500 mt-3 leading-4 font-normal text-[14px]"}>Enter the position of the item you want <br/> (e.g "1" for classic cheeseburger)</span>*/}
            {/*        </div>*/}
            {/*        <div className=" gap-3 p-3 rounded-md flex flex-col">*/}
            {/*            {menu.map((item, index) => (*/}
            {/*                <div className={" rounded-md flex justify-between cursor-pointer bg-white p-3"} key={index}>*/}
            {/*                    <div>*/}
            {/*                        <div>*/}
            {/*                            {item.name}*/}
            {/*                        </div>*/}
            {/*                        <div className={"text-gray-500 text-[14px]"}>*/}
            {/*                            {item.description}*/}
            {/*                        </div>*/}
            {/*                    </div>*/}
            {/*                    <div>*/}
            {/*                        {item.price}*/}
            {/*                    </div>*/}
            {/*                </div>*/}
            {/*            ))}*/}
            {/*            <span className="justify-end flex text-[12px]">{formatDate(timestamp)}</span>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*)}*/}



            <div className={"mt-auto relative"}>
                <input
                    value={value}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault(); // stops form submit if inside <form>
                            buttonClicked();
                        }
                    }}
                    onChange={handleChange}
                    placeholder={"Enter number here..."} className={"border w-full p-4 rounded-2xl border-gray-400"}/>
                <button onClick={buttonClicked} className={"bg-red-600 absolute right-4 top-2 cursor-pointer active:scale-105 transition-transform rounded-[100px] p-2 flex items-center w-[40px] h-[40px]"}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 32 32"><path fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M29 3L3 15l12 2.5M29 3L19 29l-4-11.5M29 3L15 17.5"/></svg>
                </button>
            </div>

        </div>

    </>
  )
}

export default ChatBox
