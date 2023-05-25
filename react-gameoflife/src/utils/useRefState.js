import { useRef, useState } from 'react';

export default function useRefState(value) {
    const [storedValue, setStoredValue] = useState(value);
    const storedValueRef = useRef(storedValue);
    storedValueRef.current = storedValue;
    return [storedValueRef, setStoredValue];
}