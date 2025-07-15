# Backend Connection Status

## 🔍 Current Status

Your frontend is configured to connect to:

```
https://bracketesports-backend.onrender.com/api
```

## ⚠️ Connection Issues

The backend appears to be unreachable. This could be due to:

1. **Render Cold Start** - Free tier apps sleep after inactivity and take 30-60 seconds to wake up
2. **Deployment Issues** - Backend might not be properly deployed
3. **Different API Path** - API might be on a different route

## 🔧 Troubleshooting Steps

### 1. Check Render Dashboard

- Go to [render.com](https://render.com) dashboard
- Check if your backend service is running
- Look at the logs for any errors
- Manual deploy if needed

### 2. Wake Up the Backend

Try accessing these URLs in your browser to wake up the service:

- https://bracketesports-backend.onrender.com
- https://bracketesports-backend.onrender.com/health
- https://bracketesports-backend.onrender.com/api/health

### 3. Test Common API Endpoints

Once the backend is awake, test these endpoints:

- `GET /api/auth/test` - Test authentication
- `GET /api/tournaments` - Get tournaments
- `POST /api/auth/register` - Test registration

### 4. Check API Base Path

Your integration guide mentions `/api` prefix, but verify if the backend uses:

- `/api/auth/login` (current config)
- `/auth/login` (without /api prefix)
- Different route structure

## 🚀 Next Steps

1. **Visit your Render dashboard** and ensure the backend is deployed and running
2. **Check the logs** for any deployment or runtime errors
3. **Try manual deployment** if the service is stopped
4. **Update the API URL** if the path is different

## 💡 Alternative Options

If the backend is having issues, you can:

1. **Deploy a new backend** using your integration guide as reference
2. **Use local backend** for development (change URL to `http://localhost:5000/api`)
3. **Create Next.js API routes** as a temporary solution

## 📞 Need Help?

Check your Render dashboard at: https://dashboard.render.com/

The backend needs to be running for your frontend to work properly!
