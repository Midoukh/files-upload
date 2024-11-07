import FileUpload from "@/components/FileUpload";

export default function Home() {
  return (
    <div style={{
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      width: '100vw',
      height: '100vh',
      backgroundImage: "url('/images/bg.png')",
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <FileUpload />
    </div>
  );
}
