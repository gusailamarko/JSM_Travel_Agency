import { OAuthProvider, Query, ID } from "appwrite";
import { account, appwriteConfig, database } from "./client";
import { redirect } from "react-router";

//export const -> USED WITHIN FRONTEND
export const loginWithGoogle = async () => {
    try
    {
        account.createOAuth2Session(
            OAuthProvider.Google
        )
    }
    catch(e)
    {
        console.log('loginWithGoogle', e);
    }
}

export const logoutUser = async () => {
    try
    {
        await account.deleteSession('current');
        return true;
    }
    catch(e)
    {
        console.log('logoutUser', e);
        return false;
    }
}

export const getUser = async () => {
    try
    {
        const user = await account.get();
        if(!user)
        {
            return redirect('/sign-in');
        }
        const { documents } = await database.listDocuments(
            appwriteConfig.databaseID, 
            appwriteConfig.usersCollectionID, 
            [
                Query.equal('accountId', user.$id),
                Query.select(["name", "email", "imageUrl", "joinedAt", "accountId"])
            ]
        )

        if(documents.length === 0)
        {
            return await storeUserData();
        }
        return documents[0];
    }
    catch(e)
    {
        console.log('getUser', e);
        return null;
    }
}

export const getGooglePicture = async () => {
    try
    {
        const session = await account.getSession('current');
        const oAuthToken = session.providerAccessToken;
        if(!oAuthToken)
        {
            console.log('No OAuth token found');
            return null;
        }

        const response = await fetch(
            'https://people.googleapis.com/v1/people/me?personFields=photos',
            {
                headers: {
                    Authorization: `Bearer ${oAuthToken}`
                }
            }
        )

        if(!response.ok)
        {
            console.log('Failed to fetch Google profile picture');
            return null;
        }

        const data = await response.json();
        const photoUrl = data.photos && data.photos.length > 0
            ? data.photos[0].url
            : null;

        return photoUrl;
    }
    catch(e)
    {
        console.log('getGooglePicture', e);
        return null;
    }
}

export const storeUserData = async () => {
    try
    {
        const user = await account.get();
        if(!user)
        {
            return null;
        }

        const { documents } = await database.listDocuments(
            appwriteConfig.databaseID, 
            appwriteConfig.usersCollectionID, 
            [
                Query.equal('accountId', user.$id),
            ]
        );

        if(documents.length > 0)
        {
            return documents[0];
        }
        const imageUrl = await getGooglePicture();

        const newUser = await database.createDocument(
            appwriteConfig.databaseID,
            appwriteConfig.usersCollectionID,
            ID.unique(),
            {
                accountId: user.$id,
                email: user.email,
                name: user.name,
                imageUrl: imageUrl || '',
                joinedAt: new Date().toISOString()
            }
        )
        return newUser;
    }
    catch(e)
    {
        console.log('storeUserData', e);
        return null;
    }
}

export const getExistingUser = async () => {
    try
    {
        const user = await account.get();
        if(!user) return null;

        const { documents } = await database.listDocuments(
            appwriteConfig.databaseID,
            appwriteConfig.usersCollectionID,
            [
                Query.equal('accountId', user.$id)
            ]
        )

        if(documents.length === 0) return null;
        return documents[0];
    }
    catch(e)
    {
        console.log('getExistingUser', e);
        return null;
    }
}