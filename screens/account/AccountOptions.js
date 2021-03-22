import { map } from 'lodash';
import React,{useState} from 'react'
import { Alert, StyleSheet, Text, View } from 'react-native'
import { Icon, ListItem } from 'react-native-elements';
import Modal from '../../components/Modal';
import ChangeEmailForm from './ChangeEmailForm';
import ChangeNames from './ChangeNames';

export default function AccountOptions({user,setReloadUser,toastRef}) {
    const [isVisibleModal, setIsVisibleModal] = useState(false)
    const [renderComponent, setRenderComponent] = useState(null)

    const selectedComponent = (key) => {
        switch (key) {
            case "names":
                setRenderComponent(
                    <ChangeNames
                        displayName = {user.displayName}
                        setShowM = {setIsVisibleModal}
                        toastRef = {toastRef}
                        setReloadUser = {setReloadUser}
                    />
                )
                 break;
            case "email":
                setRenderComponent(
                    <ChangeEmailForm
                        email = {user.email}
                        setShowM = {setIsVisibleModal}
                        toastRef = {toastRef}
                        setReloadUser = {setReloadUser}
                    />
                )
                break;
            case "password":
                setRenderComponent(
                    <Text>Password</Text>
                )
                 break;
        
        }
        setIsVisibleModal(true);
    }
    const generateOptions = () => {
        return [
            {
                title: "Change names",
                iconNameLeft: "account-circle",
                iconColorLeft: "#47240d",
                iconNameRight: "chevron-right",
                iconColorRight: "#47240d",
                onPress: () => selectedComponent("names")
            },
            {
                title: "Email",
                iconNameLeft: "at",
                iconColorLeft: "#47240d",
                iconNameRight: "chevron-right",
                iconColorRight: "#47240d",
                onPress: () => selectedComponent("email")
            },
            {
                title: "Change password",
                iconNameLeft: "lock-reset",
                iconColorRight: "#47240d",
                iconNameRight: "chevron-right",
                iconColorRight: "#47240d",
                onPress: () => selectedComponent("password")
            }
        ];
    }
    const menuOptions = generateOptions();

    return (
        <View>
          {
                map(menuOptions, (menu, index) => (
                    <ListItem
                    key={index}
                    style={styles.menuItem}
                    onPress={menu.onPress}
                     >
                        <Icon
                            type="material-community"
                            name={menu.iconNameLeft}
                            color = {menu.iconColorLeft}
                        />
                        <ListItem.Content>
                            <ListItem.Title>{menu.title}</ListItem.Title>
                        </ListItem.Content>
                        <Icon
                            type="material-community"
                            name={menu.iconNameRight}
                            color = {menu.iconColorRight}
                            />
                    </ListItem>
                ))

          }
          <Modal 
            isVisible={isVisibleModal} 
            setVisible={setIsVisibleModal}
            children= {renderComponent}
            > 
                {renderComponent}
            </Modal>
        </View>
    )
  
}





const styles = StyleSheet.create({
    menuItem: {
        borderBottomWidth:1,
        borderBottomColor:"#8b766a"
    }
})
