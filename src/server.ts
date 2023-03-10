import express from 'express';
import bodyParser from 'body-parser';
import { filterImageFromURL, deleteLocalFiles } from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  //! END @TODO1

  app.get("/filteredimage", async (req: any, res: any) => {
    const { image_url }: { image_url: string } = req.query;
    let regex = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
    console.log("1.validate the image_url query");
    if (!image_url.match(regex)) {
      return res.status(400)
        .send(`Image Path not valid!`);
    }
    console.log("2.call filterImageFromURL(image_url) to filter the image");
    filterImageFromURL(image_url).then((data) => {
      console.log("3.send the resulting file in the response");
      res.status(200).sendFile(data, function (error:any) {
        if (error) {
          console.log(`loading file have error: ` + error);
        } else {
          console.log("4. deletes any files on the server on finish of the response");
          deleteLocalFiles([data]);
          console.log(`-----------FINISHED: deleted file: ` + data);
        }
      });
    }).catch(() => {
      console.log(`-------------ERROR: try others------------- `);
      return res.status(400).send(`Could not read image. Please try new one.<br> Example: https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Sacred_lotus_Nelumbo_nucifera.jpg/640px-Sacred_lotus_Nelumbo_nucifera.jpg`
      )
      ;
    })

  });

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}")
  });


  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();