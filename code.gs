function buildCard(){
  var cardBuilder = CardService.newCardBuilder();
  cardBuilder.setHeader(CardService.newCardHeader()
        .setTitle('スタンプを送る'));
  var imageSection = getImageSection();
  cardBuilder.addSection(imageSection);
  var card = cardBuilder.build();
  return [card];
}

function getImageSection() {
  var imageSection = CardService.newCardSection()
    .setHeader("選択してください");
  var urls = getImageURLs();
  for (var i=0; i<urls.length; i++){
    var url = urls[i];
    var openEmailAction = CardService.newAction()
    .setFunctionName("openEmail")
    .setParameters({imageSrc: url})
    ;
    var imageButton = CardService.newImage()
    .setAltText("image")
    .setImageUrl(url)
    .setComposeAction(openEmailAction, CardService.ComposedEmailType.REPLY_AS_DRAFT)
    ;
    
    imageSection.addWidget(imageButton);
  }
  
  return imageSection;
}


function openEmail(query){
  //need an access token to open messages
  var accessToken = query.messageMetadata.accessToken;
  GmailApp.setCurrentMessageAccessToken(accessToken);
  var messageId = query.messageMetadata.messageId;
  var message = GmailApp.getMessageById(messageId);
  var url = query.parameters.imageSrc;
  //if the last message is from yourself,
  // the recipient address becomes yourself...
  // to avoid this, cc the correct recipient
  var draft;
  var userEmail = Session.getActiveUser().getEmail();
  //the last message is from yourself
  if (message.getFrom().indexOf(userEmail) > -1){
    draft = message.createDraftReplyAll( "", {
    htmlBody: "<img src='cid:imagesrc'/>",
    inlineImages: {
              "imagesrc": UrlFetchApp.fetch(url)
                           .getBlob()
                  } 
      });
  } else { //the last message is from the other user
    draft = message.createDraftReply( "", {
    htmlBody: "<img src='cid:imagesrc'/>",
    inlineImages: {
              "imagesrc": UrlFetchApp.fetch(url)
                           .getBlob()
                  } 
      });
  }
  
  return CardService.newComposeActionResponseBuilder()
        .setGmailDraft(draft).build();
}

function getImageURLs(){
  var urls = [
    "https://i.imgur.com/NLaDqmH.png",
    "https://i.imgur.com/GrnGlzA.png",
    "https://i.imgur.com/0qXJ99M.png",
    "https://i.imgur.com/0tQ7iBq.png"
    ];
  
  return urls;
}
