import * as ImagePicker from 'expo-image-picker'
import { CLOUDINARY_URL, UPLOAD_PRESET } from '@env'

export function useImage() {

    async function uploadImage(uri) {
        try {
            const formData = new FormData()

            const file = uri.split('/').pop()
            const match = /\.(\w+)$/.exec(file);
            const type = match ? `image/${match[1]}` : 'image/jpeg';

            formData.append('file', {
                uri,
                type,
                name: file,
            })

            formData.append('upload_preset', UPLOAD_PRESET)

            const response = await fetch(CLOUDINARY_URL, {
                method: 'POST',
                body: formData,
            })

            const data = await response.json()

            if (response.ok) {
                return data.secure_url
            } else {
                throw new Error(data?.error?.message || 'Erro ao enviar foto.')
            }
        } catch (error) {
            console.error(error)
            throw new Error('Erro ao enviar imagem.')
        }
    }

    async function pickImage() {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()

            if (status !== 'granted') {
                throw new Error('Permissão negada para acessar a galeria.')
            }

            const response = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                aspect: [4,4],
                quality: 0.8
            })

            if (!response.canceled) 
                return response.assets[0].uri

        } catch (error) {
            throw new Error(error.message || 'Erro ao selecionar imagem.')
        }
    }

    async function takeImage() {
        try {
            const { status } = await ImagePicker.requestCameraPermissionsAsync()

            if (status !== 'granted') {
                throw new Error('Permissão negada para usar a câmera.')
            }

            const response = await ImagePicker.launchCameraAsync({
                aspect: [4,3],
                quality: 0.8
            })

            if (!response.canceled) 
                return response.assets[0].uri

        } catch (error) {
            console.error(error)
            throw new Error(error.message || 'Erro ao tirar a foto.')
        }
    }

    return { uploadImage, pickImage, takeImage }
}
