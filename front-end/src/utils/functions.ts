export const formattedDateTime = (dateTime: string) => {
    const dateObject = new Date(dateTime);
    return dateObject.toLocaleString('en-US');
}