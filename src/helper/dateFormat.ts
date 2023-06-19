export const dateFormat1 = (date: string | undefined) => {

    if (!date) {
        return '';
    }
    const dateObject = new Date(date);
    const day = dateObject.getDate().toString().padStart(2, '0');
    const month = (dateObject.getMonth() + 1).toString().padStart(2, '0');
    const year = dateObject.getFullYear();
    const hours = dateObject.getHours().toString().padStart(2, '0');
    const minutes = dateObject.getMinutes().toString().padStart(2, '0');

    const formattedDate = `${hours}:${minutes} ${day}/${month}/${year}`;

    return formattedDate;
};

export const dateFormat2 = (date: string | undefined) => {

    if (!date) {
        return '';
    }
    const dateObject = new Date(date);
    const day = dateObject.getDate().toString().padStart(2, '0');
    const month = (dateObject.getMonth() + 1).toString().padStart(2, '0');
    const year = dateObject.getFullYear();
    const hours = dateObject.getHours().toString().padStart(2, '0');
    const minutes = dateObject.getMinutes().toString().padStart(2, '0');

    const formattedDate = `${hours}:${minutes} - ${day}/${month}/${year}`;

    return formattedDate;
};

export const getDate = (date: string) => {
    const dateObject = new Date(date);
    return dateObject.toLocaleDateString('en-GB', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
    });
};
