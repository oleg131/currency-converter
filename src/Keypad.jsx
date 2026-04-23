export default function Keypad({ callback }) {
    return (
        <div className="flex items-center justify-center w-full">
            <div className="*:text-gray-800 grid grid-cols-3 gap-2 text-xl w-full">
                <button
                    onClick={() => {
                        callback("clear");
                    }}
                    className="font-mono col-span-3 bg-red-500 hover:bg-red-400 rounded-full p-5"
                >
                    C
                </button>
                {/* <button
                    onClick={() => {
                        callback("divide");
                    }}
                    className="font-mono bg-purple-500 hover:bg-purple-400 rounded-full p-5"
                >
                    &divide;
                </button> */}

                <button
                    onClick={() => {
                        callback(1);
                    }}
                    className="font-mono bg-gray-500 hover:bg-gray-400 rounded-full p-5"
                >
                    1
                </button>
                <button
                    onClick={() => {
                        callback(2);
                    }}
                    className="font-mono bg-gray-500 hover:bg-gray-400 rounded-full p-5"
                >
                    2
                </button>
                <button
                    onClick={() => {
                        callback(3);
                    }}
                    className="font-mono bg-gray-500 hover:bg-gray-400 rounded-full p-5"
                >
                    3
                </button>
                {/* <button
                    onClick={() => {
                        callback("multiply");
                    }}
                    className="font-mono bg-purple-500 hover:bg-purple-400 rounded-full p-5"
                >
                    &times;
                </button> */}

                <button
                    onClick={() => {
                        callback(4);
                    }}
                    className="font-mono bg-gray-500 hover:bg-gray-400 rounded-full p-5"
                >
                    4
                </button>
                <button
                    onClick={() => {
                        callback(5);
                    }}
                    className="font-mono bg-gray-500 hover:bg-gray-400 rounded-full p-5"
                >
                    5
                </button>
                <button
                    onClick={() => {
                        callback(6);
                    }}
                    className="font-mono bg-gray-500 hover:bg-gray-400 rounded-full p-5"
                >
                    6
                </button>
                {/* <button
                    onClick={() => {
                        callback("subtract");
                    }}
                    className="font-mono bg-purple-500 hover:bg-purple-400 rounded-full p-5"
                >
                    &minus;
                </button> */}

                <button
                    onClick={() => {
                        callback(7);
                    }}
                    className="font-mono bg-gray-500 hover:bg-gray-400 rounded-full p-5"
                >
                    7
                </button>
                <button
                    onClick={() => {
                        callback(8);
                    }}
                    className="font-mono bg-gray-500 hover:bg-gray-400 rounded-full p-5"
                >
                    8
                </button>
                <button
                    onClick={() => {
                        callback(9);
                    }}
                    className="font-mono bg-gray-500 hover:bg-gray-400 rounded-full p-5"
                >
                    9
                </button>
                {/* <button
                    onClick={() => {
                        callback("add");
                    }}
                    className="font-mono bg-purple-500 hover:bg-purple-400 rounded-full p-5"
                >
                    +
                </button> */}

                <button
                    onClick={() => {
                        callback(0);
                    }}
                    className="font-mono bg-blue-500 hover:bg-blue-400 rounded-full p-5"
                >
                    0
                </button>
                <button
                    onClick={() => {
                        callback("000");
                    }}
                    className="font-mono bg-blue-500 hover:bg-blue-400 rounded-full p-5"
                >
                    000
                </button>
                <button
                    onClick={() => {
                        callback(".");
                    }}
                    className="font-mono bg-blue-500 hover:bg-blue-400 rounded-full p-5"
                >
                    .
                </button>
                {/* <button
                    onClick={() => {
                        callback("equals");
                    }}
                    className="font-mono col-span-3 bg-purple-500 hover:bg-purple-400 rounded-full p-5"
                >
                    =
                </button> */}
            </div>
        </div>
    );
}
