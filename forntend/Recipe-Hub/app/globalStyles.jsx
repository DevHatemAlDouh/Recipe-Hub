import { StyleSheet } from 'react-native';

const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    
  },
  image: {
    width: "100%",
    height: "100%",
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16, 
  },
  title: {
    color: 'white',
    fontSize: 42,
    fontWeight: 'bold',
    textAlign: "center",
    marginBottom: 19,
  },
  sign_In_Up_title: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  subtitle: {
    color: 'white',
    fontSize: 16,
    textAlign: "center",
    marginBottom: 50,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  forget: {
    textAlign: "left", // محاذاة النص إلى الجهة اليسرى
    color: "#fff", // لون النص
    alignSelf: "flex-start", // تأكيد أن النص يتحرك إلى بداية الحاوية
    width: '100%', // التأكد من أن النص يأخذ العرض الكامل للحاوية
    marginBottom: 10, // إضافة مسافة أسفل النص
    paddingHorizontal: 15, // مسافة إضافية من الجوانب
  },
  

  /////////////////////////////////////////////////////////     Inputs & Icons     //////////////////////////////////////////////////////////////


  
  
  inputContainer: {
    flexDirection: "row", // ترتيب العناصر بشكل أفقي
    alignItems: "center", // محاذاة العناصر عمودياً
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 25,
    borderWidth: 1.5,
    borderColor: 'white',
    marginBottom: 20,
    paddingHorizontal: 15, // زيادة المسافة بين الأيقونة والنص
    width: 300,
    height: 50, 
  },
  input: {
    flex: 1, // يجعل الحقل يمتد ليشغل المساحة المتبقية
    color: 'white',
    paddingHorizontal: 10, // المسافة بين النص والحافة الداخلية
    fontSize: 16,
  },
  icon: {
    fontSize:20,
    color:"white",
    marginRight: 10, // المسافة بين الأيقونة والنص
    paddingLeft: 5, // إضافة padding داخلي إلى الأيقونة لجعلها داخل الحقل
 
  },
  

 
  
    /////////////////////////////////////////////////////////     Buttons     //////////////////////////////////////////////////////////////
    backButton: {
      position: 'absolute',
      top: 50, // تعديل حسب الحاجة
      left: 20,
      zIndex: 10,
      padding: 10,
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // خلفية شفافة لتمييز الزر
      borderRadius: 50,
    },
    
    
    
    button: {
    backgroundColor: '#007BFF', // لون الخلفية
    paddingVertical: 12, // التباعد العلوي والسفلي
    paddingHorizontal: 20, // التباعد الجانبي
    borderRadius: 10, // الحواف الدائرية
    marginTop: 20, // المسافة العلوية
  },
  buttonText: {
    color: '#fff', // لون النص
    fontSize: 21, // حجم الخط
    fontWeight: 'bold', // الخط عريض
    textAlign: 'center', // النص في المنتصف
  },
    
    
    
    
    signInButton: {
      backgroundColor: "rgba(0,0,0,0.5)", // تحديد لون خلفية الزر
      marginBottom: 29, // إضافة هامش أسفل الزر
      marginTop: 40, // إضافة هامش أعلى الزر
      width: '90%', // جعل الزر أكبر (90% بدلاً من 80%)
      height: 60, // زيادة ارتفاع الزر
    },
    createAccountButton: {
      backgroundColor: "rgba(255, 102, 0, 0.8)", // تحديد لون خلفية الزر
      width: '90%', // جعل الزر أكبر (90% بدلاً من 80%)
      height: 60, // زيادة ارتفاع الزر
    },
    createSignIn: {
      color: 'white', // تحديد لون النص داخل الزر
      fontSize: 24, // زيادة حجم الخط داخل الزر
      fontWeight: 'bold', // جعل النص عريض داخل الزر
      textAlign: "center", // توسيط النص داخل الزر
      padding: 15, // زيادة الحواف داخل الزر
      borderRadius: 50, // جعل الزر مستدير الحواف
      width: 270, // جعل الزر أكبر (90% بدلاً من 80%)
      height: 60, // زيادة ارتفاع الزر
      borderColor: 'white', // تحديد لون حافة الزر
      borderWidth: 0.7, // تحديد سمك حافة الزر
    },
    PressableButton: {
      borderRadius: 25, // جعل الزر مستدير الحواف
      justifyContent: 'center', // توسيط النص داخل الزر
      alignItems: 'center', // توسيط النص أفقيًا داخل الزر
      backgroundColor: "rgba(255, 102, 0, 0.8)", // تحديد لون خلفية الزر
      color: 'white', // تحديد لون النص داخل الزر
      fontSize: 24, // زيادة حجم الخط داخل الزر
      fontWeight: 'bold', // جعل النص عريض داخل الزر
      borderWidth: 0.7, // تحديد سمك حافة الزر
      width: '90%', // جعل الزر أكبر (90% بدلاً من 80%)
      height: 60, // زيادة ارتفاع الزر
    },
  
    ///////////////////////////////////////////////////////////  errorText  ///////////////////////////////////////////////////////////

    errorText: {
      color: 'red',
      fontSize: 14,
      marginTop: -1,
      marginBottom: 10
    },


  });
  
export default globalStyles;
