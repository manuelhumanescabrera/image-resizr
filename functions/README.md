# Google Cloud Resize Image Function
## How to deploy
To deploy to Google Cloud you should install gcloud in your system and configure it to use a own project. Then you should execute the command below to deploy the function:

```bash
gcloud functions deploy 'image-resizr' --runtime nodejs18 --trigger-http --entry-point=resizeImage
```

**Note: You have to set API_URL constant in the code before deploy it. This url should be accessible from internet**