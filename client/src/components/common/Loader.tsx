import { Loader2 } from "lucide-react";

function Loader({ text }: { readonly text: string }) {
    return (
        <div className="flex items-center space-x-2">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            <p>{text}</p>
        </div>
    );
}

export default Loader;