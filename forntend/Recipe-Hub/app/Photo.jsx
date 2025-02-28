// import React, { useState } from 'react';
// import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
// import * as ImagePicker from 'expo-image-picker';

// const Photo = () => {
//     const [image, setImage] = useState(null);

//     const pickImage = async () => {
//         let result = await ImagePicker.launchImageLibraryAsync({
//             mediaTypes: ImagePicker.MediaTypeOptions.Images,
//             allowsEditing: true,
//             aspect: [4, 3],
//             quality: 1,
//         });

//         if (!result.canceled) {
//             setImage(result.assets[0].uri);
//         }
//     };

//     return (
//         <View style={styles.container}>
//             <Text style={styles.title}>Photo Component</Text>
            
//             <TouchableOpacity style={styles.button} onPress={pickImage}>
//                 <Text style={styles.buttonText}>اختر صورة</Text>
//             </TouchableOpacity>

//             {image && (
//                 <Image 
//                     source={{ uri: image }} 
//                     style={styles.image} 
//                 />
//             )}
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         alignItems: 'center',
//         padding: 20
//     },
//     title: {
//         fontSize: 24,
//         marginBottom: 20
//     },
//     button: {
//         backgroundColor: '#007AFF',
//         padding: 15,
//         borderRadius: 10,
//         marginBottom: 20
//     },
//     buttonText: {
//         color: 'white',
//         fontSize: 18
//     },
//     image: {
//         width: 300,
//         height: 300,
//         borderRadius: 10,
//         resizeMode: 'contain'
//     }
// });

// export default Photo;