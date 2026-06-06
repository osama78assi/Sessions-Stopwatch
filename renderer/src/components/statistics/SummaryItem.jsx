export default function SummaryItem({ title, icon, data }) {
    return (
        <div className="flex justify-between items-center rounded-lg basis-[50%] p-1 px-2 bg-(--secondary-color) transition-colors">
            <div className="flex flex-col p-1">
                <h2 className="text-lg font-bold text-(--main-interactive-color-v1) transition-colors">
                    {title}
                </h2>
                <span className="text-md">{data}</span>
            </div>
            <span className="text-3xl h-fit bg-(--thirdary-color) text-(--main-interactive-color-v1) p-2 rounded-lg transition-colors">
                {icon}
            </span>
        </div>
    );
}
