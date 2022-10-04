import { TypedUseSelectorHook, useSelector } from "react-redux";
import { RootState } from "../store/redux/reducers";

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
