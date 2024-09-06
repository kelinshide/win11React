import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Icon, ToolBar, LazyComponent } from "../../../utils/general";

export const EdgeMenu = () => {
  const wnapp = useSelector((state) => state.apps.edge);
  // console.log(wnapp);
  const [url, setUrl] = useState("https://www.google.com/?igu=1");
  const [ierror, setErr] = useState(true);
  const [isTyping, setTyping] = useState(false);
  const [hist, setHist] = useState(["https://bing.com", "https://bing.com"]);
  const dispatch = useDispatch();
  // 右键删除收藏菜单的可见性和位置
  const [contextMenu, setContextMenu] = useState({ show: false, coords: null });

  const [iframes, setIframes] = useState({
    "https://www.google.com/webhp?igu=1": "Google",
    "https://bing.com": "Bing",
    "https://www.youtube.com/embed/m0EHSoZzHEA": "Youtube",
    "https://blueedge.me": "blueedge",
    "https://andrewstech.me": "\nandrewstech",
    "https://blueedge.me/unescape": "Unescape",
    "https://win11.blueedge.me": "Inception",
    "https://open.spotify.com/embed/user/jhfivkgdtg4s97pwbo1rbvr9v/playlist/6IdR78TOog83PV4XhLDvWN":
      "Spotify",
    "https://bluelab.blueedge.me": "BlueLab",
    "https://othello.blueedge.me": "Othello",
  });

  // const iframes = {
  //   "https://www.google.com/webhp?igu=1": "Google",
  //   "https://bing.com": "Bing",
  //   "https://www.youtube.com/embed/m0EHSoZzHEA": "Youtube",
  //   "https://blueedge.me": "blueedge",
  //   "https://andrewstech.me": "\nandrewstech",
  //   "https://blueedge.me/unescape": "Unescape",
  //   "https://win11.blueedge.me": "Inception",
  //   "https://open.spotify.com/embed/user/jhfivkgdtg4s97pwbo1rbvr9v/playlist/6IdR78TOog83PV4XhLDvWN":
  //     "Spotify",
  //   "https://bluelab.blueedge.me": "BlueLab",
  //   "https://othello.blueedge.me": "Othello",
  // };

  const favicons = {
    "https://andrewstech.me":
      "https://avatars.githubusercontent.com/u/45342431",
  };

  const isValidURL = (string) => {
    var res = string.match(
      /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g,
    );
    return res !== null;
  };


  const action = (e) => {
    var iframe = document.getElementById("isite");
    var x = e.target && e.target.dataset.payload;

    if (iframe && x == 0) {
      iframe.src = iframe.src;
    } else if (iframe && x == 1) {
      setHist([url, "https://www.bing.com"]);
      setUrl("https://www.bing.com");
      setTyping(false);
    } else if (iframe && x == 2) {
      setHist([url, "https://www.google.com/webhp?igu=1"]);
      setUrl("https://www.google.com/webhp?igu=1");
      setTyping(false);
    } else if (iframe && x == 3) {
      if (e.key === "Enter") {
        var qry = e.target.value;

        if (isValidURL(qry)) {
          if (!qry.startsWith("http")) {
            qry = "https://" + qry;
          }
        } else {
          qry = "https://www.bing.com/search?q=" + qry;
        }

        e.target.value = qry;
        setHist([hist[0], qry]);
        setUrl(qry);
        setTyping(false);
      }
    } else if (x == 4) {
      setUrl(hist[0]);
      setTyping(false);
    } else if (x == 5) {
      setUrl(hist[1]);
      setTyping(false);
    } else if (x == 6) {
      var tmp = e.target.dataset.url;
      setHist([url, tmp]);
      setUrl(tmp);
      setTyping(false);
    }
  };

  const typing = (e) => {
    if (!isTyping) {
      setTyping(true);
      console.log([url, url]);
      setHist([url, url]);
    }
    setUrl(e.target.value);
  };

  const handleFailed = () => {
    setErr(false);
  };

  const [newUrl, setNewUrl] = useState([]);

  useEffect(() => {
    if (wnapp.url) {
      setTyping(false);
      setUrl(wnapp.url);
      dispatch({ type: "EDGELINK" });
    }
    // 监听整个文档的点击事件  用来取消右键菜单
    if (contextMenu.show) {
      document.addEventListener('click', handleClickOutside);
    } else {
      // 否则移除点击事件监听器
      document.removeEventListener('click', handleClickOutside);
    }
    // 如果localStorage中有收藏的网址，就把它们放到iframes中
    if (localStorage.getItem("collectUrl")) {
      // newUrl = localStorage.getItem("collectUrl").split(",")
      let urls = localStorage.getItem("collectUrl").split(",");
      setNewUrl(urls);
      // 这里也不能直接把newUrl放到iframes中，因为newUrl是个useState，不会立即更新，所以要用urls
      urls.forEach((url) => {
        setIframes(previframes => {
          return {
            ...previframes,
            [url]: url,
          };
        });
      })
    }
  }, [contextMenu.show]);


  // 新加的收藏功能
  const collect = () => {
    if (url in iframes) {
      alert("Already in collection");
    } else {
      // alert("Added to collection");
      setIframes(previframes => {
        return {
          ...previframes,
          [url]: url,
        };
      });
      // newUrl.push(url)
      setNewUrl([...newUrl, url]);
      console.log(newUrl);
      // 这里是个坑啊 如果直接localStorage存newUrl的话，newUrl还没更新还是上一次的
      localStorage.setItem("collectUrl", [...newUrl, url].join(","));
    }

  }

  const deleteCollect = () => {
    console.log(contextMenu.url in iframes);
    console.log(newUrl);
    if (newUrl.some(url => url === contextMenu.url)) {
      setNewUrl(newUrl.filter(url => url !== contextMenu.url));
      localStorage.setItem("collectUrl", newUrl.filter(url => url !== contextMenu.url).join(","));
    }
    setIframes(previframes => {
      const newIframes = { ...previframes };
      delete newIframes[contextMenu.url];
      return newIframes;
    })

    setContextMenu({ show: false, coords: null });
  }
  // 点击其他地方关掉右键菜单
  const handleClickOutside = (event) => {

    // 检查点击位置是否在上下文菜单之外
    if (!event.target.closest('.context-menu')) {
      setContextMenu({ show: false, coords: null, payload: null, url: null });
    }
  };



  const handleContextMenu = (event, payload, url) => {
    // 阻止浏览器的默认行为，浏览器默认右键是有事件的
    event.preventDefault();

    // 设置上下文菜单的状态
    setContextMenu({
      show: true,
      coords: { x: event.clientX, y: event.clientY },
      payload: payload,
      url: url,
    });

    document.addEventListener('click', handleClickOutside);
  };
  const handleOverlayClick = () => {
    console.log('handleOverlayClick');
    setContextMenu({ show: false, coords: null });
  };

  return (
    <div
      className="edgeBrowser floatTab dpShad"
      data-size={wnapp.size}
      data-max={wnapp.max}
      style={{
        ...(wnapp.size == "cstm" ? wnapp.dim : null),
        zIndex: wnapp.z,
      }}
      data-hide={wnapp.hide}
      id={wnapp.icon + "App"}
    >
      {/* 这个ToolBar是实现窗口可拖动 可变大小 右上角三个图标的 */}
      <ToolBar
        app={wnapp.action}
        icon={wnapp.icon}
        size={wnapp.size}
        name="Browser"
        float
      />
      <div className="windowScreen flex flex-col">
        <div className="overTool flex">
          <Icon src={wnapp.icon} width={14} margin="0 6px" />
          <div className="btab">
            <div>{url ? url : 'New Tab'}</div>
            <Icon
              fafa="faTimes"
              click={wnapp.action}
              payload="close"
              width={10}
            />
          </div>
        </div>
        <div className="restWindow flex-grow flex flex-col">
          {/* 网址那一栏 */}
          <div className="addressBar w-full h-10 flex items-center">
            <Icon
              className="edgenavicon"
              src="left"
              onClick={action}
              payload={4}
              width={14}
              ui
              margin="0 8px"
            />
            <Icon
              className="edgenavicon"
              src="right"
              onClick={action}
              payload={5}
              width={14}
              ui
              margin="0 8px"
            />
            <Icon
              fafa="faRedo"
              onClick={action}
              payload={0}
              width={14}
              margin="0 8px"
            />
            <Icon
              fafa="faHome"
              onClick={action}
              payload={1}
              width={18}
              margin="0 16px"
            />
            {/* 收藏按钮 */}
            <Icon
              // fafa="faHome"
              src="spotify"
              onClick={collect}
              payload={1}
              width={18}
              margin="0 6px"
            />
            <div className="addCont relative flex items-center">
              <input
                className="w-full h-6 px-4"
                onKeyDown={action}
                onChange={typing}
                data-payload={3}
                value={url}
                placeholder="Type url or a query to search"
                type="text"
              />
              <Icon
                className="z-1 handcr"
                src="google"
                ui
                onClick={action}
                payload={2}
                width={14}
                margin="0 10px"
              />
            </div>
          </div>
          {/* 收藏夹那一栏图标 */}
          <div className="w-full bookbar py-2">
            <div className="flex">
              {Object.keys(iframes).map((mark, i) => {
                return (
                  <div
                    key={i}
                    className="flex handcr items-center ml-2 mr-1 prtclk"
                    onClick={action}
                    onContextMenu={(e) => handleContextMenu(e, 6, mark)}
                    data-payload={6}
                    data-url={mark}
                  >
                    <Icon
                      className="mr-1"
                      ext
                      width={16}
                      // 这个src能自动匹配图标，因为大多数现代网站都会在根目录下放置一个 favicon.ico 文件，这个文件通常就是网站的图标，试试https://www.bilibili.com/favicon.ico 就知道了
                      src={
                        iframes[mark][0] != "\n"
                          ? new URL(mark).origin + "/favicon.ico"
                          : favicons[mark]
                      }
                    />
                    <div className="text-xs">{iframes[mark].trim()}</div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="siteFrame flex-grow overflow-hidden">
            {/* show={!wnapp.hide} 这个的作用是网址变化时，隐藏掉iframe，否则还有种切换网址是，页面还在原网站上面的感觉 */}
            <LazyComponent show={!wnapp.hide}>
              {/* 透明的罩子 当右键删除菜单出现时，监听罩子的点击事件 */}
              {contextMenu.show && (
                <div
                  className="absolute w-full h-full"
                  style={{ zIndex: 10, backgroundColor: 'transparent' }}
                  onClick={handleOverlayClick}
                ></div>
              )}
              <iframe
                src={!isTyping ? url : hist[0]}
                id="isite"
                frameborder="0"
                className="w-full h-full"
                title="site"
              // onError={handleIframeError}
              ></iframe>
            </LazyComponent>

            <div
              className={`bg-blue-100 w-64 rounded dpShad p-2 absolute bottom-0 right-0 my-4 mx-12 transition-all ${ierror ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
            >
              <div
                className="absolute bg-red-400 m-1 text-red-900 text-xs px-1 font-bold handcr top-0 right-0 rounded hover:bg-red-500"
                onClick={handleFailed}
              >
                x
              </div>
              <div className="text-gray-800 text-xs font-medium">
                If it shows <b>"Refused to connect"</b>, then{" "}
                <b>that website doesn't allow </b>
                other websites to show their content. <b>I cannot fix it</b>.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 右键的菜单 */}
      {contextMenu.show && (
        <div
          className="context-menu"
          style={{
            position: 'absolute',
            left: contextMenu.coords.x,
            top: contextMenu.coords.y,
            backgroundColor: 'white',
            border: '1px solid #ddd',
            borderRadius: '8px', // 圆角
            padding: '10px', // 内边距
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // 阴影
            zIndex: 11, // 置顶
          }}
        >
          <button
            style={{
              backgroundColor: '#007bff', // 背景颜色
              color: 'white', // 字体颜色
              border: 'none', // 去除边框
              padding: '8px 16px', // 按钮内边距
              borderRadius: '4px', // 按钮圆角
              cursor: 'pointer', // 鼠标移入样式
              transition: 'background-color 0.3s', // 过渡效果
            }}
            onClick={(e) => {
              e.stopPropagation(); // 阻止事件冒泡
              deleteCollect();
            }}
          >
            删除收藏
          </button>
        </div>
      )}
    </div>
  );
};
