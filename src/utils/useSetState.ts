import { Dispatch, SetStateAction, useCallback, useState } from 'react';

export type RecursivePartial<T> = {
    [P in keyof T]?: T[P] extends (...args: any[]) => any ? T[P] : RecursivePartial<T[P]>;
};

export type SetPatch<T> = (
    patch: RecursivePartial<T> | ((prevState: T) => RecursivePartial<T>)
) => void;

export const useSetState = <T extends Record<any, any> | null>(initialState: T | (() => T)) => {
    const [state, setState] = useState<T>(initialState);
    const patchState = useCallback(
        (patch) =>
            setState((prevState) => ({
                ...prevState,
                ...(patch instanceof Function ? patch(prevState) : patch),
            })),
        [setState]
    );

    return [state, patchState, setState] as [T, SetPatch<T>, Dispatch<SetStateAction<T>>];
};
