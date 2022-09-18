
export const localStorageEffect = key => ({setSelf, onSet}) => {
    console.log("local storage effect running for: ", key);

    const savedValue = localStorage.getItem(key)
    if (savedValue != null) {
      setSelf(JSON.parse(savedValue));
    } 
  
    onSet((newValue, _, isReset) => {
      console.log("onset called for: ", key, newValue);
      isReset
        ? localStorage.removeItem(key)
        : localStorage.setItem(key, JSON.stringify(newValue));
    });
  };