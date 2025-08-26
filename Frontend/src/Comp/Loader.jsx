export default function Loader() {
 return(
     <div
       style={{
        position: '',
        top: 0,
        left:0 ,
        width: '',
        height: '',
        background: 'rgba(255, 255, 255, 0.8)',
        display: 'flex',
        justifyContent: '',
        alignItems: '',
        zIndex: 9999,
      }}
      className='md:ml-auto flex mt-60 md:mt-0  justify-center items-center md:h-full'
    >
     <div style={{ textAlign: 'center' }}>
        <div
          style={{
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #3498db',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 10px',
          }}
        >

        </div>
        <p>Loading...</p>
      </div>
    </div>
    )
}
