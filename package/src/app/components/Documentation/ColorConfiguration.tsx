export const ColorConfiguration = () => {
  return (
    <>
      <h3 className=" text-xl font-semibold mt-8 text-black">Colors</h3>
      <div className="p-6 rounded-md border mt-4 border-dark_border/60">
        <p className="text-base font-medium text-muted/60">
          <span className="font-semibold text-lg text-black">
            1. Override Colors
          </span>{" "}
          <br />
          For any change in colors : src/app/globals.css
        </p>
        <div className="py-4 px-5 rounded-md bg-dark_grey mt-8">
          <p className="text-sm text-black/60 flex flex-col gap-2">
            <span>--color-primary: "#0066FF",</span>
            <span>--color-purple: "#1E013A",</span>
            <span>--color-grey: "#F4F5F6",</span>
            <span>--color-border: "#DBDBDB",</span>
            <span>--color-darkmode: "#00224a",</span>
            <span>--color-deep-slate: "#02398A",</span>
          </p>
        </div>
      </div>
      <div className="p-6 rounded-md border mt-4 border-dark_border/60">
        <p className="text-base font-medium text-muted/60">
          <span className="font-semibold text-lg text-black">
            2. Override Theme Colors
          </span>{" "}
          <br />
          For change , go to : src/app/globals.css
        </p>
        <div className="py-4 px-5 rounded-md bg-dark_grey mt-8">
          <p className="text-sm text-black/60 flex flex-col gap-2">
            <span>--color-primary: "#0066FF",</span>
            <span>--color-darkmode: "#00224a",</span>
          </p>
        </div>
      </div>
    </>
  );
};
